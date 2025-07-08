import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/db/schemas/index.ts',
	dialect: 'sqlite',
	casing: 'snake_case',
	out: './migrations',

	verbose: true,
	strict: true
});
