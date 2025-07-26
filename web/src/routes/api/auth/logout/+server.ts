import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AUTH_COOKIE_NAME } from '$lib/auth.server';
import * as tables from '$lib/db/schemas';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	try {
		const { session } = locals.auth;

		if (session) {
			// Delete the session from the database
			await locals.db.delete(tables.sessions).where(eq(tables.sessions.id, session.id));
		}

		// Clear the auth cookie
		cookies.delete(AUTH_COOKIE_NAME, { path: '/' });

		return json({ success: true });
	} catch (error) {
		console.error('Logout error:', error);
		return json(
			{
				success: false,
				message: 'Internal server error.'
			},
			{ status: 500 }
		);
	}
};