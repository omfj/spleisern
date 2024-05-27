# Spleiser'n

Spleiser'n is an application to create settlements after buying products with multiple people.

Uses Clerk for authentication and is deployed on Cloudflare on the Workers platform using D1.

## Features

- Share settlements with a unique link
- See settlement history
- Scan receipts with ChatGPT 4o vision to automatically add products

## Development

### Prerequisites

- Node.js >= 20
- pnpm

### Setup

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Create a `.dev.vars` following the `.dev.vars.example` file
4. Run the migrations with `pnpm db:apply`
5. Run the development server with `pnpm dev`
