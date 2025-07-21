#[cfg(test)]
pub mod test_utils {
    use std::env;
    use std::sync::Mutex;

    lazy_static::lazy_static! {
        static ref TEST_MUTEX: Mutex<()> = Mutex::new(());
    }

    /// A guard that ensures test isolation by:
    /// 1. Acquiring a global mutex to prevent concurrent environment variable modifications
    /// 2. Saving original environment variable values
    /// 3. Automatically restoring original state when dropped
    pub struct EnvGuard {
        _guard: std::sync::MutexGuard<'static, ()>,
        original_vars: Vec<(String, Option<String>)>,
    }

    impl EnvGuard {
        /// Create a new EnvGuard that will protect the specified environment variables
        pub fn new(env_vars: &[&str]) -> Self {
            let guard = TEST_MUTEX.lock().unwrap();
            let mut original_vars = Vec::new();

            for var_name in env_vars {
                let original_value = env::var(var_name).ok();
                original_vars.push((var_name.to_string(), original_value));
            }

            Self {
                _guard: guard,
                original_vars,
            }
        }

        /// Convenience method for common Spleis environment variables
        pub fn spleis() -> Self {
            Self::new(&["SPL_SESSION_TOKEN", "SPLEIS_BASE_URL", "HOME"])
        }

        /// Convenience method for auth-related environment variables
        pub fn auth() -> Self {
            Self::new(&["SPL_SESSION_TOKEN", "HOME"])
        }

        /// Set an environment variable (will be restored on drop)
        pub fn set_var(&self, key: &str, value: &str) {
            unsafe { env::set_var(key, value) };
        }

        /// Remove an environment variable (will be restored on drop)
        pub fn remove_var(&self, key: &str) {
            unsafe { env::remove_var(key) };
        }
    }

    impl Drop for EnvGuard {
        fn drop(&mut self) {
            // Restore original environment variables
            for (var_name, original_value) in &self.original_vars {
                match original_value {
                    Some(value) => unsafe { env::set_var(var_name, value) },
                    None => {
                        if env::var(var_name).is_ok() {
                            unsafe { env::remove_var(var_name) };
                        }
                    }
                }
            }
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn test_env_guard_single_var() {
            let guard = EnvGuard::new(&["TEST_VAR_1"]);

            guard.set_var("TEST_VAR_1", "test_value");
            assert_eq!(env::var("TEST_VAR_1").unwrap(), "test_value");

            drop(guard);

            // Should be removed after guard is dropped
            assert!(env::var("TEST_VAR_1").is_err());
        }

        #[test]
        fn test_env_guard_preserves_original() {
            // Set up original state
            unsafe { env::set_var("TEST_VAR_2", "original_value") };

            {
                let guard = EnvGuard::new(&["TEST_VAR_2"]);
                guard.set_var("TEST_VAR_2", "new_value");
                assert_eq!(env::var("TEST_VAR_2").unwrap(), "new_value");
            }

            // Should restore original value
            assert_eq!(env::var("TEST_VAR_2").unwrap(), "original_value");

            // Clean up
            unsafe { env::remove_var("TEST_VAR_2") };
        }

        #[test]
        fn test_env_guard_spleis_convenience() {
            let guard = EnvGuard::new(&["TEST_SPL_SESSION_TOKEN", "TEST_SPLEIS_BASE_URL"]);

            guard.set_var("TEST_SPL_SESSION_TOKEN", "test_token");
            guard.set_var("TEST_SPLEIS_BASE_URL", "http://test.com");

            assert_eq!(env::var("TEST_SPL_SESSION_TOKEN").unwrap(), "test_token");
            assert_eq!(env::var("TEST_SPLEIS_BASE_URL").unwrap(), "http://test.com");
        }
    }
}
