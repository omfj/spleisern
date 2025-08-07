import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { settlements, members, products, membersToProducts } from '$lib/db/schemas';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	try {
		const spleisId = params.id;
		const currentUserId = locals.auth.user?.id;

		if (!currentUserId) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Fetch the settlement to check ownership
		const settlement = await locals.db
			.select()
			.from(settlements)
			.where(eq(settlements.id, spleisId))
			.limit(1);

		if (settlement.length === 0) {
			throw error(404, 'Spleis not found');
		}

		const spleis = settlement[0];

		// Check if the current user is the owner
		if (spleis.owner !== currentUserId) {
			return json({ error: 'Only the owner can delete this spleis' }, { status: 403 });
		}

		// Delete in the correct order due to foreign key constraints
		// 1. Delete member-product assignments
		await locals.db
			.delete(membersToProducts)
			.where(
				eq(
					membersToProducts.productId,
					locals.db
						.select({ id: products.id })
						.from(products)
						.where(eq(products.settlementId, spleisId))
				)
			);

		// 2. Delete products
		await locals.db.delete(products).where(eq(products.settlementId, spleisId));

		// 3. Delete members
		await locals.db.delete(members).where(eq(members.settlementId, spleisId));

		// 4. Delete the settlement itself
		await locals.db.delete(settlements).where(eq(settlements.id, spleisId));

		return json({
			success: true,
			message: 'Spleis deleted successfully'
		});
	} catch (err) {
		console.error('Error deleting spleis:', err);
		if (err instanceof Error && err.message.includes('not found')) {
			return json({ error: 'Spleis not found' }, { status: 404 });
		}
		return json({ error: 'Failed to delete spleis' }, { status: 500 });
	}
};
