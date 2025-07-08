import type { Cookies } from '@sveltejs/kit';
import type { Database } from './db/drizzle';
import type { Session } from './db/schemas';

export const AUTH_COOKIE_NAME = '__auth_token';

export function generateUserId() {
	return crypto.randomUUID();
}

export function generateSessionToken() {
	return crypto.randomUUID();
}

export function getAuthSession(cookies: Cookies) {
	return cookies.get(AUTH_COOKIE_NAME);
}

export function setAuthSession(cookies: Cookies, session: Session) {
	cookies.set(AUTH_COOKIE_NAME, session.sessionToken, {
		path: '/',
		expires: session.expiresAt
	});
}

export async function getAuthUser(cookies: Cookies, db: Database) {
	const sessionToken = getAuthSession(cookies);
	if (!sessionToken) {
		return {
			user: null,
			session: null
		};
	}

	const s = await db.query.sessions.findFirst({
		where: (t, { eq }) => eq(t.sessionToken, sessionToken),
		with: {
			user: true
		}
	});

	if (!s?.user) {
		return {
			user: null,
			session: null
		};
	}

	const { user, ...session } = s;

	return {
		user,
		session
	};
}
