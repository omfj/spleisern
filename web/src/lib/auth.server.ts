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

export function getAuthSession(cookies: Cookies, headers: Headers) {
	const cookie = cookies.get(AUTH_COOKIE_NAME);
	if (cookie) {
		return cookie;
	}
	const header = headers.get('Authorization');
	if (header && header.startsWith('Bearer ')) {
		return header.slice('Bearer '.length);
	}
	return null;
}

export function setAuthSession(cookies: Cookies, session: Session) {
	cookies.set(AUTH_COOKIE_NAME, session.sessionToken, {
		path: '/',
		expires: session.expiresAt
	});
}

export async function getAuthUser(cookies: Cookies, headers: Headers, db: Database) {
	const sessionToken = getAuthSession(cookies, headers);
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
