import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schemas';

const client = createClient({
	url: DATABASE_URL,
});

export const db = drizzle(client, {
	schema,
});
