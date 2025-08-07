import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { reverseFormatAccountNumber } from '$lib/account-number';
import * as tables from '$lib/db/schemas';
import { addDays } from 'date-fns';
import { setAuthSession, generateSessionToken } from '$lib/auth.server';

export const actions: Actions = {
	default: async ({ request, locals, cookies, platform }) => {
		const formData = await request.formData();
		const accNum = formData.get('password') as string;

		if (!accNum) {
			return fail(400, {
				success: false,
				message: 'Account number is required.'
			});
		}

		let accountNumber;
		try {
			accountNumber = reverseFormatAccountNumber(accNum.trim().toLowerCase());
		} catch {
			return fail(400, {
				success: false,
				message: 'Invalid account number format.'
			});
		}

		try {
			const account = await locals.db.query.accounts.findFirst({
				where: (t, { eq, and }) =>
					and(eq(t.provider, 'account-number'), eq(t.providerAccountId, accountNumber))
			});

			if (!account) {
				return fail(500, {
					success: false,
					message: 'Account not found.'
				});
			}

			const user = await locals.db.query.users.findFirst({
				where: (t, { eq }) => eq(t.id, account.userId)
			});

			if (!user) {
				return fail(500, {
					success: false,
					message: 'User not found.'
				});
			}

			const expiresAt = addDays(new Date(), 15);
			const sessionId = crypto.randomUUID();
			const authSecret = platform!.env.AUTH_SECRET;

			const jwtToken = await generateSessionToken(sessionId, user.id, authSecret);

			const session = await locals.db
				.insert(tables.sessions)
				.values({
					id: sessionId,
					sessionToken: jwtToken,
					userId: user.id,
					expiresAt: expiresAt
				})
				.returning()
				.then((rows) => rows[0]);

			setAuthSession(cookies, session);
		} catch (err) {
			console.error('Login error:', err);
			return fail(500, {
				success: false,
				message: 'Failed to log in. Please try again later.'
			});
		}

		redirect(303, '/');
	}
};
