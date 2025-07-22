use std::env;

pub const DEFAULT_BASE_URL: &str = "https://spleis.omfj.no";
pub const SESSION_TOKEN_ENV: &str = "SPL_SESSION_TOKEN";
pub const BASE_URL_ENV: &str = "SPLEIS_BASE_URL";
pub const TOKEN_FILE_NAME: &str = ".spleis-token";

#[derive(Debug, Clone)]
pub struct Config {
    pub base_url: String,
}

impl Config {
    pub fn new() -> Self {
        let base_url = env::var(BASE_URL_ENV).unwrap_or(DEFAULT_BASE_URL.to_string());

        Self { base_url }
    }

    pub fn with_base_url(base_url: String) -> Self {
        Self { base_url }
    }
}

impl Default for Config {
    fn default() -> Self {
        Self::new()
    }
}
