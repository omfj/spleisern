# GitHub Copilot Instructions

## Project Context

This is Spleis, a monorepo for expense splitting with SvelteKit web app and Rust CLI. The app helps users scan receipts with OCR, split expenses among group members, and manage settlements.

## Code Style & Conventions

### TypeScript/Svelte

- Use TypeScript with strict mode
- Prefer `const` over `let`, avoid `var`
- Use destructuring for object/array access
- Import types with `import type {}`
- Use Svelte 5 syntax with runes (`$state`, `$derived`, `$effect`)
- Component props use `interface` definitions
- Use TailwindCSS classes for styling
- Prefer `clsx` for conditional classes

### Database & API

- Use Drizzle ORM with snake_case columns
- **Prefer Drizzle query syntax over raw SQL whenever possible**
- Database schemas in `web/src/lib/db/schemas/`
- API routes follow SvelteKit conventions in `src/routes/api/`
- Use Zod for input validation
- SQLite/D1 database with migrations in `migrations/`

### Rust CLI

- Use `anyhow` for error handling
- Structure with `clap` derive macros for CLI
- Async functions with `tokio`
- Use `reqwest` for HTTP requests
- Follow Rust naming conventions (snake_case)

## Architecture Patterns

### Web App Structure

- Routes: `(app)/` for authenticated, `(unauth)/` for public
- Components in `src/lib/components/` are reusable UI elements
- Database connection via `src/lib/db/drizzle.ts`
- Authentication handled in `src/lib/auth.server.ts`
- User context management with stores

### Key Entities

- Users (authentication and profiles)
- Accounts (bank account information)
- Products (items from receipts)
- Members (people in expense groups)
- Settlements (final calculations)

### OCR Integration

- Uses Mistral AI for receipt processing
- PDF uploads handled via `/api/ocr` endpoint
- File uploads use `FileUpload.svelte` component

## Development Guidelines

### Testing

- Unit tests with Vitest in `*.test.ts` files
- E2E tests with Playwright in `e2e/` directory
- Always test database operations and API endpoints

### Database Operations

- **Always prefer Drizzle query builder over raw SQL**
- Generate migrations: `pnpm db:generate`
- Apply locally: `pnpm db:migrate`
- Use transactions for multi-table operations
- Validate input with Zod schemas

### Error Handling

- Use `Result` types where appropriate
- Provide meaningful error messages
- Log errors appropriately for debugging
- Handle edge cases (empty arrays, null values)

### Performance

- Use `$derived` for computed values in Svelte
- Implement proper loading states
- Optimize database queries with proper indexes

## Common Patterns

### Form Handling

```typescript
// Use form actions with validation
export const actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData();
    const parsed = schema.safeParse(Object.fromEntries(data));
    // Handle validation and database operations
  },
};
```

### Component Structure

```svelte
<script lang="ts">
  interface Props {
    // Define props with TypeScript interfaces
  }

  let { prop1, prop2 }: Props = $props();

  // Use runes for reactivity
  let state = $state(initialValue);
  let computed = $derived(someCalculation);
</script>
```

### Database Queries

```typescript
// Use Drizzle query builder syntax
const results = await db.query.table.findMany({
  where: (t, { eq }) => eq(table.cokumn, value),
  with: {
    otherTable: true,
  },
});

// For complex queries, still prefer Drizzle over raw SQL
const complexQuery = await db
  .select({
    id: table.id,
    name: table.name,
    count: sql<number>`count(${otherTable.id})`,
  })
  .from(table)
  .leftJoin(otherTable, eq(table.id, otherTable.foreignKey))
  .groupBy(table.id);
```

### API Responses

```typescript
// Consistent API response structure
return json({ success: true, data: result });
// or
return json({ success: false, error: "Message" }, { status: 400 });
```

## Technology Stack

- **Frontend**: SvelteKit 5, TypeScript, TailwindCSS 4
- **Backend**: SvelteKit API routes, Cloudflare Workers
- **Database**: SQLite/D1 with Drizzle ORM
- **CLI**: Rust with Tokio, Clap, Reqwest
- **Testing**: Vitest, Playwright
- **Deployment**: Cloudflare Workers with Wrangler
