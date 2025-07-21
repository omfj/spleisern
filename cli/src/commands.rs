use colored::Colorize;
use dialoguer::{Input, MultiSelect, Select};
use rfd::FileDialog;

use crate::{auth::LocalAuth, client::SpleisClient, error::Result};

pub async fn create_bill() -> Result<()> {
    let token = LocalAuth::get_token().expect("You must be logged in to create a bill.");
    let client = SpleisClient::new();
    if !client.get_user_info(&token).await.is_ok() {
        println!("{}", "You must be logged in to create a bill.".red().bold());
        return Ok(());
    }

    let current_dir = std::env::current_dir().unwrap();

    let title: String = Input::new().with_prompt("Title").interact_text().unwrap();
    let description: String = Input::new()
        .with_prompt("Description")
        .interact_text()
        .unwrap();

    let is_public: bool = Select::new()
        .with_prompt("Is this public?")
        .default(0)
        .items(&["Yes", "No"])
        .interact()
        .map(|i| i == 0)
        .unwrap();

    let bill_path = FileDialog::new()
        .add_filter("text", &["pdf"]) // OCR only supports PDF files for now
        .set_directory(current_dir)
        .pick_file()
        .unwrap();

    let bill_content = client.upload_receipt(&token, &bill_path).await?;

    if bill_content.is_empty() {
        println!(
            "{}",
            "Failed to upload the bill. Please try again.".red().bold()
        );
        return Ok(());
    }

    let members: Vec<String> = Input::new()
        .with_prompt("Members (comma separated)")
        .default("".to_string())
        .interact_text()
        .unwrap()
        .split(',')
        .map(|s| s.trim().to_string())
        .collect();

    // For every item, assign one or more members
    let mut items: Vec<(String, Vec<String>)> = vec![];
    loop {
        let item_name: String = Input::new()
            .with_prompt("Item name (or 'done' to finish)")
            .interact_text()
            .unwrap();

        if item_name.to_lowercase() == "done" {
            break;
        }

        let selected_indices: Vec<usize> = MultiSelect::new()
            .with_prompt("Select members for this item")
            .items(&members)
            .interact()
            .unwrap();

        let selected_members: Vec<String> = selected_indices
            .into_iter()
            .map(|index| members[index].clone())
            .collect();

        items.push((item_name, selected_members));
    }

    println!("{}: {}", "Title".bold(), title.green());
    println!("{}: {}", "Description".bold(), description.green());
    println!(
        "{}: {}",
        "Is Public".bold(),
        if is_public { "Yes" } else { "No" }.green()
    );
    println!(
        "{}: {}",
        "Bill Path".bold(),
        bill_path.display().to_string().green()
    );
    println!("{}: {:?}", "Members".bold(), members);
    println!("{}: {:?}", "Items".bold(), items);

    Ok(())
}

pub async fn login(account_number: String) -> Result<()> {
    let client = SpleisClient::new();
    let session_token = client.login(account_number).await?;

    // Store the session token in the environment variable
    LocalAuth::set_token(&session_token)?;

    println!("{}", "Login successful!".green().bold());

    Ok(())
}

pub fn logout() -> Result<()> {
    LocalAuth::clear_token().ok();

    println!("{}", "Logged out successfully.".green().bold());

    Ok(())
}

pub async fn show_user() -> Result<()> {
    if let Some(token) = LocalAuth::get_token() {
        let client = SpleisClient::new();
        match client.get_user_info(&token).await {
            Ok(user_info) => {
                println!("{}: {}", "User ID".bold(), user_info.id.to_string().green());
                println!("{}: {}", "Name".bold(), user_info.name.green());
            }
            Err(e) => {
                println!("Error fetching user info: {}", e.to_string().red().bold());
            }
        }
    } else {
        println!("{}", "No user is currently logged in.".red().bold());
    }

    Ok(())
}
