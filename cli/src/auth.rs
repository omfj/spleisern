use std::{env, fs, path::PathBuf};

use crate::{
    config::{Config, SESSION_TOKEN_ENV},
    error::{Result, SpleisError},
};

pub struct LocalAuth;

impl LocalAuth {
    /// Gets the session token from the environment variable or file system
    pub fn get_token() -> Option<String> {
        // Check for environment variable first
        if let Ok(token) = env::var(SESSION_TOKEN_ENV) {
            return Some(token);
        }

        // If not found, check for the file in the home directory
        Self::get_token_file_path()
            .and_then(|path| fs::read_to_string(&path).ok())
            .map(|token| token.trim().to_string())
    }

    pub fn set_token(token: &str) -> Result<()> {
        let token_path = Self::get_token_file_path()
            .ok_or_else(|| SpleisError::ConfigError("Could not find home directory".to_string()))?;

        fs::write(&token_path, token).map_err(SpleisError::FileSystemError)?;
        Ok(())
    }

    pub fn clear_token() -> Result<()> {
        // Clear the environment variable
        if env::var(SESSION_TOKEN_ENV).is_ok() {
            unsafe { env::remove_var(SESSION_TOKEN_ENV) };
        }

        // Remove the file in the home directory
        if let Some(token_path) = Self::get_token_file_path()
            && token_path.exists()
        {
            fs::remove_file(token_path).map_err(SpleisError::FileSystemError)?;
        }

        Ok(())
    }

    fn get_token_file_path() -> Option<PathBuf> {
        dirs::home_dir().map(|home| home.join(Config::get_token_file_name()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::test_utils::test_utils::EnvGuard;
    use tempfile::TempDir;

    #[test]
    fn test_get_token_from_env() {
        let guard = EnvGuard::auth();

        guard.set_var(SESSION_TOKEN_ENV, "test_token_env");

        let token = LocalAuth::get_token();
        assert_eq!(token, Some("test_token_env".to_string()));
    }

    #[test]
    fn test_get_token_from_file() {
        let guard = EnvGuard::auth();

        // Remove env var to force reading from file
        guard.remove_var(SESSION_TOKEN_ENV);

        let temp_dir = TempDir::new().unwrap();
        let token_path = temp_dir.path().join(Config::get_token_file_name());
        fs::write(&token_path, "test_token_file").unwrap();

        // Mock home directory
        guard.set_var("HOME", temp_dir.path().to_str().unwrap());

        let token = LocalAuth::get_token();
        assert_eq!(token, Some("test_token_file".to_string()));
    }

    #[test]
    fn test_get_token_none() {
        let guard = EnvGuard::auth();

        guard.remove_var(SESSION_TOKEN_ENV);

        let temp_dir = TempDir::new().unwrap();
        guard.set_var("HOME", temp_dir.path().to_str().unwrap());

        let token = LocalAuth::get_token();
        assert_eq!(token, None);
    }

    #[test]
    fn test_set_token() {
        let guard = EnvGuard::auth();

        let temp_dir = TempDir::new().unwrap();
        guard.set_var("HOME", temp_dir.path().to_str().unwrap());

        let result = LocalAuth::set_token("test_token");
        assert!(result.is_ok());

        let token_path = temp_dir.path().join(Config::get_token_file_name());
        let saved_token = fs::read_to_string(token_path).unwrap();
        assert_eq!(saved_token, "test_token");
    }

    #[test]
    fn test_clear_token() {
        let guard = EnvGuard::auth();

        let temp_dir = TempDir::new().unwrap();
        guard.set_var("HOME", temp_dir.path().to_str().unwrap());
        guard.set_var(SESSION_TOKEN_ENV, "test_token");

        let token_path = temp_dir.path().join(Config::get_token_file_name());
        fs::write(&token_path, "test_token").unwrap();

        let result = LocalAuth::clear_token();
        assert!(result.is_ok());

        assert!(!token_path.exists());
        assert!(env::var(SESSION_TOKEN_ENV).is_err());
    }
}
