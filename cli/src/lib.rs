pub mod auth;
pub mod cli;
pub mod client;
pub mod commands;
pub mod config;
pub mod error;
pub mod types;

#[macro_export]
macro_rules! is_dev {
    () => {{ cfg!(debug_assertions) }};
}

#[cfg(test)]
pub mod test_utils;

// Re-export commonly used types
pub use error::{Result, SpleisError};
pub use types::*;
