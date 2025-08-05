use crate::{Result, commands, is_dev};
use clap::{Parser, Subcommand};

#[derive(Parser, Clone, Debug)]
#[command(name = "spleis-cli", version)]
pub struct Cli {
    #[command(subcommand)]
    pub command: Commands,

    /// Configuration file path
    #[arg(short, long, global = true, value_name = "FILE")]
    pub config: Option<String>,
}

#[derive(Subcommand, Clone, Debug)]
pub enum Commands {
    /// Create and manage bills
    #[command(subcommand)]
    Bill(BillCommands),

    /// Authentication commands
    #[command(subcommand)]
    Auth(AuthCommands),

    /// Configuration management
    #[command(subcommand)]
    Config(ConfigCommands),
}

#[derive(Subcommand, Clone, Debug)]
pub enum BillCommands {
    /// Create a new bill from a receipt
    Create,

    /// List your bills
    List {
        /// Show only public bills
        #[arg(long)]
        public_only: bool,

        /// Limit the number of results
        #[arg(short, long, default_value = "20")]
        limit: u32,
    },

    /// Show details of a specific bill
    Show {
        /// Bill ID
        bill_id: String,
    },
}

#[derive(Subcommand, Clone, Debug)]
pub enum AuthCommands {
    /// Login with your account number
    Login {
        /// Account number to log in with
        #[arg(short, long)]
        account_number: String,
    },

    /// Logout and clear stored credentials
    Logout,

    /// Show current user information
    Show,
}

#[derive(Subcommand, Clone, Debug)]
pub enum ConfigCommands {
    /// Show current configuration
    Show,
}

impl Cli {
    /// Run the CLI application
    pub async fn run(self) -> Result<()> {
        match self.command.clone() {
            Commands::Bill(bill_cmd) => self.handle_bill_command(bill_cmd).await,

            Commands::Auth(auth_cmd) => self.handle_auth_command(auth_cmd).await,

            Commands::Config(config_cmd) => self.handle_config_command(config_cmd).await,
        }
    }

    async fn handle_bill_command(&self, command: BillCommands) -> Result<()> {
        match command {
            BillCommands::Create => {
                // For now, use the existing create_bill function
                // In the future, we could pass these parameters
                commands::create_bill().await
            }

            BillCommands::List { public_only, limit } => {
                println!(
                    "Listing bills (public_only: {}, limit: {})",
                    public_only, limit
                );
                // TODO: Implement bill listing
                Ok(())
            }

            BillCommands::Show { bill_id } => {
                println!("Showing bill: {}", bill_id);
                // TODO: Implement show bill
                Ok(())
            }
        }
    }

    async fn handle_auth_command(&self, command: AuthCommands) -> Result<()> {
        match command {
            AuthCommands::Login { account_number } => commands::login(account_number).await,

            AuthCommands::Logout => commands::logout(),

            AuthCommands::Show => commands::show_user().await,
        }
    }

    async fn handle_config_command(&self, command: ConfigCommands) -> Result<()> {
        match command {
            ConfigCommands::Show => {
                println!("Current configuration:");
                println!(
                    "Base URL: {}",
                    std::env::var("SPLEIS_BASE_URL").unwrap_or("http://localhost:5173".to_string())
                );
                println!("Is DEV: {}", is_dev!());
                // TODO: Show more config options
                Ok(())
            }
        }
    }
}
