use std::path::Path;

use colored::Colorize;
use reqwest::{Url, multipart::Form};

use crate::{
    auth::LocalAuth,
    config::Config,
    error::{Result, SpleisError},
    types::{ReceiptItem, SpleisLoginSuccessResponse, UserInfoResponse},
};

pub struct SpleisClient {
    config: Config,
    http_client: reqwest::Client,
}

impl SpleisClient {
    pub fn new() -> Self {
        Self {
            config: Config::new(),
            http_client: reqwest::Client::new(),
        }
    }

    pub fn with_config(config: Config) -> Self {
        Self {
            config,
            http_client: reqwest::Client::new(),
        }
    }

    pub async fn login(&self, account_number: String) -> Result<String> {
        let url = self.build_url("/api/auth/login")?;
        let body = serde_json::json!({
            "accountNumber": account_number,
        });

        let response = self
            .http_client
            .post(url)
            .header("Content-Type", "application/json")
            .json(&body)
            .send()
            .await?
            .error_for_status()?
            .json::<SpleisLoginSuccessResponse>()
            .await?;

        if !response.success {
            return Err(SpleisError::AuthError(response.session_token));
        }

        Ok(response.session_token)
    }

    pub async fn get_user_info(&self, token: &str) -> Result<UserInfoResponse> {
        let url = self.build_url("/api/auth/profile")?;

        let response = self
            .http_client
            .get(url)
            .bearer_auth(token)
            .send()
            .await?
            .error_for_status()?
            .json::<UserInfoResponse>()
            .await?;

        Ok(response)
    }

    pub async fn create_spleis(&self) -> Result<()> {
        let token = LocalAuth::get_token().ok_or(SpleisError::TokenNotFound)?;
        let url = self.build_url("/api/spleis/create")?;

        let response = self
            .http_client
            .post(url)
            .bearer_auth(&token)
            .send()
            .await?
            .error_for_status()?;

        if response.status().is_success() {
            println!("{}", "Spleis created successfully.".green().bold());
        } else {
            return Err(SpleisError::ConfigError(
                "Failed to create spleis".to_string(),
            ));
        }

        Ok(())
    }

    pub async fn upload_receipt<P: AsRef<Path>>(
        &self,
        token: &str,
        file_path: P,
    ) -> Result<Vec<ReceiptItem>> {
        let url = self.build_url("/api/ocr")?;
        let form = Form::new().file("file", file_path).await?;

        let response = self
            .http_client
            .post(url)
            .bearer_auth(token)
            .multipart(form)
            .send()
            .await?
            .error_for_status()?
            .json::<Vec<ReceiptItem>>()
            .await?;

        Ok(response)
    }

    fn build_url(&self, path: &str) -> Result<Url> {
        let full_url = format!("{}{}", self.config.base_url, path);
        Url::parse(&full_url).map_err(|e| SpleisError::ConfigError(format!("Invalid URL: {}", e)))
    }
}

impl Default for SpleisClient {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{config::Config, test_utils::test_utils::EnvGuard};
    use mockito::Server;
    use tempfile::TempDir;

    #[test]
    fn test_client_creation() {
        let _guard = EnvGuard::spleis();
        let client = SpleisClient::new();
        assert_eq!(client.config.base_url, "http://localhost:5173");
    }

    #[test]
    fn test_client_with_custom_config() {
        let _guard = EnvGuard::spleis();
        let config = Config::with_base_url("https://custom.url".to_string());
        let client = SpleisClient::with_config(config);
        assert_eq!(client.config.base_url, "https://custom.url");
    }

    #[tokio::test]
    async fn test_login_success() {
        let _guard = EnvGuard::spleis();

        let mut server = Server::new_async().await;
        let mock = server
            .mock("POST", "/api/auth/login")
            .with_status(200)
            .with_header("content-type", "application/json")
            .with_body(r#"{"success": true, "sessionToken": "test_token"}"#)
            .expect(1)
            .create_async()
            .await;

        let config = Config::with_base_url(server.url());
        let client = SpleisClient::with_config(config);
        let result = client.login("123456".to_string()).await;

        mock.assert_async().await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), "test_token");
    }

    #[tokio::test]
    async fn test_login_failure() {
        let _guard = EnvGuard::spleis();

        let mut server = Server::new_async().await;
        let mock = server
            .mock("POST", "/api/auth/login")
            .with_status(200)
            .with_header("content-type", "application/json")
            .with_body(r#"{"success": false, "sessionToken": "error message"}"#)
            .expect(1)
            .create_async()
            .await;

        let config = Config::with_base_url(server.url());
        let client = SpleisClient::with_config(config);
        let result = client.login("123456".to_string()).await;

        mock.assert_async().await;
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), SpleisError::AuthError(_)));
    }

    #[tokio::test]
    async fn test_get_user_info_success() {
        let _guard = EnvGuard::spleis();

        let mut server = Server::new_async().await;
        let mock = server
            .mock("GET", "/api/auth/profile")
            .match_header("authorization", "Bearer test_token")
            .with_status(200)
            .with_header("content-type", "application/json")
            .with_body(r#"{"id": "123", "name": "Test User"}"#)
            .expect(1)
            .create_async()
            .await;

        let config = Config::with_base_url(server.url());
        let client = SpleisClient::with_config(config);
        let result = client.get_user_info("test_token").await;

        mock.assert_async().await;
        assert!(result.is_ok());
        let user_info = result.unwrap();
        assert_eq!(user_info.id, "123");
        assert_eq!(user_info.name, "Test User");
    }

    #[tokio::test]
    async fn test_create_spleis_no_token() {
        let guard = EnvGuard::spleis();

        guard.remove_var("SPL_SESSION_TOKEN");
        let temp_dir = TempDir::new().unwrap();
        guard.set_var("HOME", temp_dir.path().to_str().unwrap());

        let client = SpleisClient::new();
        let result = client.create_spleis().await;

        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), SpleisError::TokenNotFound));
    }
}
