import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { reverseFormatAccountNumber } from '$lib/account-number';
import * as tables from '$lib/db/schemas';
import { addDays } from 'date-fns';

export const POST: RequestHandler = async ({ locals, request }) => {
	try {
		const jsonBody = (await request.json()) as {
			accountNumber?: string;
		};
		const accountNumber = jsonBody.accountNumber;

		if (!accountNumber || typeof accountNumber !== 'string') {
			return json(
				{
					success: false,
					message: 'Account number is required as query parameter.'
				},
				{ status: 400 }
			);
		}

		const formattedAccountNumber = reverseFormatAccountNumber(accountNumber.trim().toLowerCase());

		if (!formattedAccountNumber) {
			return json(
				{
					success: false,
					message: 'Invalid account number format.'
				},
				{ status: 400 }
			);
		}

		const account = await locals.db.query.accounts.findFirst({
			where: (t, { eq, and }) =>
				and(eq(t.provider, 'account-number'), eq(t.providerAccountId, formattedAccountNumber))
		});

		if (!account) {
			return json(
				{
					success: false,
					message: 'Account not found.'
				},
				{ status: 404 }
			);
		}

		const user = await locals.db.query.users.findFirst({
			where: (t, { eq }) => eq(t.id, account.userId)
		});

		if (!user) {
			return json(
				{
					success: false,
					message: 'User not found.'
				},
				{ status: 404 }
			);
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

		return json({
			success: true,
			sessionToken: session.sessionToken,
			expiresAt: session.expiresAt,
			user: {
				id: user.id,
				name: user.name
			}
		});
	} catch (error) {
		console.error('Login error:', error);
		return json(
			{
				success: false,
				message: 'Internal server error.'
			},
			{ status: 500 }
		);
	}
};
