import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { reverseFormatAccountNumber } from '$lib/account-number';
import * as tables from '$lib/db/schemas';
import { addDays } from 'date-fns';
import { setAuthSession } from '$lib/auth.server';

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const formData = await request.formData();
		const accNum = formData.get('password') as string;

		if (!accNum) {
			return {
				success: false,
				message: 'Account number is required.'
			};
		}

		const accountNumber = reverseFormatAccountNumber(accNum.trim().toLowerCase());

		if (!accountNumber) {
			return {
				success: false,
				message: 'Invalid account number format.'
			};
		}

		const account = await locals.db.query.accounts.findFirst({
			where: (t, { eq, and }) =>
				and(eq(t.provider, 'account-number'), eq(t.providerAccountId, accountNumber))
		});

		if (!account) {
			return {
				success: false,
				message: 'Account not found.'
			};
		}

		const user = await locals.db.query.users.findFirst({
			where: (t, { eq }) => eq(t.id, account.userId)
		});

		if (!user) {
			return {
				success: false,
				message: 'User not found.'
			};
		}

		const expiresAt = addDays(new Date(), 15);

		const session = await locals.db
			.insert(tables.sessions)
			.values({
				id: crypto.randomUUID(),
				sessionToken: crypto.randomUUID(),
				userId: user.id,
				expiresAt: expiresAt
			})
			.returning()
			.then((rows) => rows[0]);

		setAuthSession(cookies, session);

		redirect(303, '/account');
	}
};
