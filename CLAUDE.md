# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Spleis is a monorepo containing a web application for expense splitting and a Rust CLI tool for interacting with the API. The application helps users manage shared expenses, scan receipts using OCR, and split bills among group members.

## Project Structure

This is a PNPM workspace monorepo with two main components:

- **`web/`** - SvelteKit web application deployed to Cloudflare Workers
- **`cli/`** - Rust CLI tool for API interaction and receipt processing

## Development Commands

### Monorepo Level (run from root)
```bash
pnpm dev           # Start web development server
pnpm build         # Build web application
pnpm lint          # Lint web application
pnpm format        # Format web application code
pnpm db:generate   # Generate database migrations
pnpm db:migrate    # Apply database migrations locally
```

### Web Application (`web/`)
```bash
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm preview                # Preview production build locally
pnpm check                  # Run Svelte type checking
pnpm lint                   # Run ESLint and Prettier checks
pnpm format                 # Format code with Prettier
pnpm test                   # Run unit and e2e tests
pnpm test:unit              # Run Vitest unit tests
pnpm test:e2e               # Run Playwright e2e tests
pnpm db:migrate:prod        # Apply migrations to production
pnpm deploy                 # Build and deploy to Cloudflare
```

### CLI Tool (`cli/`)
```bash
cargo build --release      # Build CLI in release mode
cargo test                 # Run Rust tests
cargo run -- <args>        # Run CLI with arguments
```

## Architecture

### Web Application
- **Framework**: SvelteKit 5 with TypeScript
- **Styling**: TailwindCSS 4
- **Database**: SQLite with Drizzle ORM
- **Deployment**: Cloudflare Workers with D1 database
- **Authentication**: OAuth2 with session management
- **Testing**: Vitest for unit tests, Playwright for e2e

### Database Schema
Core entities managed through Drizzle schemas in `web/src/lib/db/schemas/`:
- `users` - User accounts and authentication
- `accounts` - Bank account information  
- `products` - Items in receipts/bills
- `members` - Group members for expense splitting
- `settlements` - Final expense calculations
- `sessions` - User session management

### Key Features
- **OCR Processing**: Uses Mistral AI for receipt scanning and text extraction
- **Expense Splitting**: Algorithm for dividing costs among group members
- **Product Assignment**: Members can be assigned to specific products/items
- **Authentication**: Secure login with session management

### CLI Tool
- **Language**: Rust with async/await (Tokio)
- **Purpose**: API interaction, receipt upload, and expense management
- **Dependencies**: Uses reqwest for HTTP, clap for CLI parsing, serde for JSON

## File Organization

### Web Routes Structure
- `(app)/` - Authenticated application routes
- `(unauth)/` - Public routes (login, register)
- `api/` - API endpoints for auth, OCR, and data management

### Component Library
Reusable UI components in `web/src/lib/components/`:
- Form inputs (button, input, textarea, etc.)
- File upload for receipt scanning
- Navigation and layout components

## Development Workflow

1. **Database Changes**: Generate migrations with `pnpm db:generate`, apply with `pnpm db:migrate`
2. **Testing**: Always run `pnpm test` before commits
3. **Linting**: Code must pass `pnpm lint` checks
4. **Deployment**: Use `pnpm deploy` for Cloudflare Workers deployment

## Environment Setup

The web application requires Cloudflare D1 database and Wrangler configuration. Local development uses SQLite with the same schema as production.