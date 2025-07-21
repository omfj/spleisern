import { getAuthUser } from '$lib/auth.server';
import { createDatabase } from '$lib/db/drizzle';
import { Mistral } from '@mistralai/mistralai';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { csrf } from './hooks/csrf';

const UNAUTH_PAGES = ['/login', '/register', '/api/auth/login'];
const ALLOWED_PATHS = ['/api/ocr'];
const ALLOWED_ORIGINS = ['https://spleis.omfj.no', 'http://localhost:5173'];

const setup: Handle = async ({ event, resolve }) => {
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

export const handle = sequence(csrf(ALLOWED_PATHS, ALLOWED_ORIGINS), setup);
