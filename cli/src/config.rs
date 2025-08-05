use std::env;

use crate::is_dev;

pub const DEFAULT_BASE_URL: &str = "https://spleis.omfj.no";
pub const SESSION_TOKEN_ENV: &str = "SPL_SESSION_TOKEN";
pub const BASE_URL_ENV: &str = "SPLEIS_BASE_URL";

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

    pub fn get_token_file_name() -> String {
        let base_file_name = ".spleis-token";
        if is_dev!() {
            format!("{}.dev", base_file_name)
        } else {
            base_file_name.to_string()
        }
    }
}

impl Default for Config {
    fn default() -> Self {
        Self::new()
    }
}
