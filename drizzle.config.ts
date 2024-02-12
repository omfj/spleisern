import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
	out: './drizzle/migrations',
	schema: './src/lib/db/schemas',
	driver: 'libsql',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
} satisfies Config;
