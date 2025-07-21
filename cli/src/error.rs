use thiserror::Error;

#[derive(Error, Debug)]
pub enum SpleisError {
    #[error("Authentication failed: {0}")]
    AuthError(String),

    #[error("Network error: {0}")]
    NetworkError(#[from] reqwest::Error),

    #[error("File system error: {0}")]
    FileSystemError(#[from] std::io::Error),

    #[error("Serialization error: {0}")]
    SerializationError(#[from] serde_json::Error),

    #[error("Configuration error: {0}")]
    ConfigError(String),

    #[error("Token not found. Please log in first.")]
    TokenNotFound,

    #[error("Invalid file format: {0}")]
    InvalidFileFormat(String),
}

pub type Result<T> = std::result::Result<T, SpleisError>;
