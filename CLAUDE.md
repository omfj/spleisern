# Spleis - Project Information for Claude

## Project Overview

This is a SvelteKit application named "Spleis" that handles expense splitting and settlement management. The application is built with modern web technologies and deployed on Cloudflare Workers in a serverless environment.

## Framework & Environment

- **Framework**: SvelteKit with Svelte 5
- **Deployment**: Cloudflare Workers (serverless)
- **Database**: Cloudflare D1 (SQLite)
- **Language**: TypeScript

## Key Libraries and Dependencies

### Core Framework

- **@sveltejs/kit** (v2.16.0) - SvelteKit framework
- **svelte** (v5.0.0) - Svelte UI framework

### Database & ORM

- **drizzle-orm** (v0.40.0) - TypeScript ORM
- **drizzle-kit** (v0.30.2) - Database migrations and schema management

### Authentication & Security

- **arctic** (v3.7.0) - OAuth2 authentication library
- **@oslojs/oauth2** (v0.5.0) - OAuth2 utilities
- **nanoid** (v5.1.5) - Unique ID generation

### Styling

- **tailwindcss** (v4.0.0) - Utility-first CSS framework
- **@tailwindcss/forms** (v0.5.9) - Form styling plugin
- **@tailwindcss/typography** (v0.5.15) - Typography plugin
- **@tailwindcss/vite** (v4.0.0) - Vite plugin for Tailwind
- **tailwind-merge** (v3.3.1) - Merge Tailwind classes utility
- **clsx** (v2.1.1) - Conditional class names utility

Use the `cn` utility in `$lib/cn` to add conditional styles and merge multiple styles.

### UI Components

- **@lucide/svelte** (v0.525.0) - Icon library

### Utilities

- **date-fns** (v4.1.0) - Date manipulation library
- **zod** (v3.25.75) - TypeScript-first schema validation

### Development Tools

- **vite** (v6.2.6) - Build tool
- **typescript** (v5.0.0) - TypeScript compiler
- **eslint** (v9.18.0) - Code linting
- **prettier** (v3.4.2) - Code formatting
- **vitest** (v3.2.3) - Testing framework
- **@playwright/test** (v1.49.1) - End-to-end testing
- **wrangler** (v4.23.0) - Cloudflare Workers CLI

## Important Development Notes

### Svelte 5 Syntax

- Use `$props()` instead of `export let` for component props
- Use `$state()` and `$derived()` for reactive state
- Use `{@render children?.()}` for slot content
- Use `$effect()` for side effects instead of `$:`

### Serverless Environment

- Code runs on Cloudflare Workers
- Limited to Edge Runtime APIs
- No Node.js-specific APIs available
- Use Web APIs (fetch, crypto, etc.) instead of Node.js equivalents

### Database

- Uses Cloudflare D1 (SQLite) with Drizzle ORM
- Run `pnpm db:generate` to generate migrations
- Run `pnpm db:migrate` for local migrations

### Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm deploy` - Deploy to Cloudflare Workers
- `pnpm test` - Run all tests
- `pnpm lint` - Run linting and formatting checks
- `pnpm check` - Run TypeScript and Svelte checks
