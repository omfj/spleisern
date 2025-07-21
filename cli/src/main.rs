use clap::Parser;
use spleis_cli::{Result, cli::Cli};

#[tokio::main]
async fn main() -> Result<()> {
    // Load environment variables from .env file if present
    dotenvy::dotenv().ok();

    // Parse CLI arguments and run the application
    let cli = Cli::parse();
    cli.run().await
}
