import type { Cookies } from '@sveltejs/kit';
import type { Database } from './db/drizzle';
import type { Session } from './db/schemas';
import { SignJWT, jwtVerify } from 'jose';

export const AUTH_COOKIE_NAME = '__auth_token';

export function generateUserId() {
	return crypto.randomUUID();
}

export async function generateSessionToken(sessionId: string, userId: string, authSecret: string) {
	const secret = new TextEncoder().encode(authSecret);

	return await new SignJWT({
		sessionId,
		userId
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('15d')
		.sign(secret);
}

export async function verifySessionToken(
	token: string,
	authSecret: string
): Promise<{ sessionId: string; userId: string } | null> {
	try {
		const secret = new TextEncoder().encode(authSecret);
		const { payload } = await jwtVerify(token, secret);

		return {
			sessionId: payload.sessionId as string,
			userId: payload.userId as string
		};
	} catch {
		return null;
	}
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

export async function getAuthUser(
	cookies: Cookies,
	headers: Headers,
	db: Database,
	authSecret: string
) {
	const sessionToken = getAuthSession(cookies, headers);
	if (!sessionToken) {
		return {
			user: null,
			session: null
		};
	}

	const verified = await verifySessionToken(sessionToken, authSecret);
	if (!verified) {
		return {
			user: null,
			session: null
		};
	}

	const s = await db.query.sessions.findFirst({
		where: (t, { eq }) => eq(t.id, verified.sessionId),
		with: {
			user: true
		}
	});

	if (!s?.user || s.userId !== verified.userId) {
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
