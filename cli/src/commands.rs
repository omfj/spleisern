use colored::Colorize;
use dialoguer::{Input, MultiSelect, Select};
use rfd::FileDialog;

use crate::{ReceiptItem, auth::LocalAuth, client::SpleisClient, error::Result};

pub async fn create_bill() -> Result<()> {
    let token = LocalAuth::get_token().expect("You must be logged in to create a bill.");
    let client = SpleisClient::new();
    if client.get_user_info(&token).await.is_err() {
        println!("{}", "You must be logged in to create a bill.".red().bold());
        return Ok(());
    }

    let current_dir = std::env::current_dir().unwrap();

    let title: String = Input::new().with_prompt("Title").interact_text().unwrap();
    let description: String = Input::new()
        .with_prompt("Description")
        .allow_empty(true)
        .interact_text()
        .unwrap();

    let is_public: bool = Select::new()
        .with_prompt("Is this public?")
        .default(0)
        .items(&["Yes", "No"])
        .interact()
        .map(|i| i == 0)
        .unwrap();

    let should_scan_receipt: bool = Select::new()
        .with_prompt("Do you want to scan a receipt?")
        .default(0)
        .items(&["Yes", "No"])
        .interact()
        .map(|i| i == 0)
        .unwrap();

    let mut items: Vec<ReceiptItem> = Vec::new();

    let bill_items = if should_scan_receipt {
        // Use a file dialog to select the bill file
        let path = FileDialog::new()
            .add_filter("text", &["pdf", "png", "jpeg", "jpg"])
            .set_directory(current_dir)
            .pick_file()
            .unwrap();

        let bill_content = client.upload_receipt(&token, &path).await?;
        Some(bill_content)
    } else {
        None
    };

    if let Some(bill_items) = bill_items {
        items.extend(bill_items);
    }

    loop {
        let item_name: String = Input::new()
            .with_prompt("Add an item (or leave empty to finish)")
            .allow_empty(true)
            .interact_text()
            .unwrap();

        if item_name.is_empty() {
            break;
        }

        let item_price: f64 = Input::new()
            .with_prompt("Enter the price for this item")
            .interact_text()
            .unwrap();

        items.push(ReceiptItem {
            name: item_name,
            price: item_price,
        });
    }

    let mut members: Vec<String> = Vec::new();

    loop {
        let member_input: String = Input::new()
            .with_prompt("Add a member (or leave empty to finish)")
            .allow_empty(true)
            .interact_text()
            .unwrap();

        if member_input.is_empty() {
            break;
        } else {
            members.push(member_input);
        }
    }

    // For every item, assign one or more members
    let mut items_to_users: Vec<(String, Vec<String>)> = vec![];
    for item in items.iter() {
        let selected_indices: Vec<usize> = MultiSelect::new()
            .with_prompt(format!("{} ({})", item.name, item.price))
            .items(&members)
            .interact()
            .unwrap();

        let selected_members: Vec<String> = selected_indices
            .into_iter()
            .map(|index| members[index].clone())
            .collect();

        items_to_users.push((item.name.clone(), selected_members));
    }

    println!("{}: {}", "Title".bold(), title.green());
    println!("{}: {}", "Description".bold(), description.green());
    println!(
        "{}: {}",
        "Is Public".bold(),
        if is_public { "Yes" } else { "No" }.green()
    );
    println!("{}: {:?}", "Members".bold(), members);
    println!("{}: {:?}", "Items".bold(), items_to_users);

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
