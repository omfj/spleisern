import { generateAccountNumber } from '$lib/account-number';
import type { Actions } from './$types';
import { generateUserId } from '$lib/auth.server';
import * as tables from '$lib/db/schemas';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;

		if (!name || name.length < 3) {
			return fail(400, {
				success: false,
				message: 'Name must be at least 3 characters long.'
			});
		}

		const userId = generateUserId();
		const accountNumber = generateAccountNumber();

		await locals.db.insert(tables.users).values({
			id: userId,
			name: name
		});

		await locals.db.insert(tables.accounts).values({
			id: userId,
			provider: 'account-number',
			providerAccountId: accountNumber,
			userId: userId
		});

		return {
			success: true,
			message: accountNumber
		};
	}
};
