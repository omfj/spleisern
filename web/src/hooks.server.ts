import { getAuthUser } from '$lib/auth.server';
import { createDatabase } from '$lib/db/drizzle';
import { Mistral } from '@mistralai/mistralai';
import { redirect } from '@sveltejs/kit';

const UNAUTH_PAGES = ['/login', '/register', '/api/auth/login'];

export const handle = async ({ event, resolve }) => {
	const d1 = event.platform!.env.DB;
	const mistralApiKey = event.platform!.env.MISTRAL_API_KEY;

	const db = createDatabase(d1);
	const mistral = new Mistral({
		apiKey: mistralApiKey
	});
	const auth = await getAuthUser(event.cookies, event.request.headers, db);

	event.locals.db = db;
	event.locals.mistral = mistral;
	event.locals.auth = auth;

	if (auth.user === null && !UNAUTH_PAGES.includes(event.url.pathname)) {
		redirect(307, '/login');
	}

	return await resolve(event);
};
