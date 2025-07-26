import { error } from '@sveltejs/kit';
import { eq, desc, countDistinct } from 'drizzle-orm';
import type { PageServerLoad } from './account/$types';
import { settlements, members, products } from '$lib/db/schemas';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.auth.user;
	if (!user) {
		error(401, 'Unauthorized');
	}

	const db = locals.db;

	try {
		// Fetch user's settlements with additional data
		const userSettlements = await db
			.select({
				id: settlements.id,
				name: settlements.name,
				description: settlements.description,
				isPublic: settlements.isPublic,
				createdAt: settlements.createdAt,
				memberCount: countDistinct(members.id),
				productCount: countDistinct(products.id)
			})
			.from(settlements)
			.leftJoin(members, eq(members.settlementId, settlements.id))
			.leftJoin(products, eq(products.settlementId, settlements.id))
			.where(eq(settlements.owner, user.id))
			.groupBy(settlements.id)
			.orderBy(desc(settlements.createdAt));

		// Calculate total amounts for each settlement
		const settlementsWithTotals = await Promise.all(
			userSettlements.map(async (settlement) => {
				const settlementProducts = await db
					.select()
					.from(products)
					.where(eq(products.settlementId, settlement.id));

				const totalAmount = settlementProducts.reduce((sum, product) => {
					return sum + product.price / 100; // Convert from cents
				}, 0);

				return {
					...settlement,
					totalAmount: Number(totalAmount.toFixed(2))
				};
			})
		);

		return {
			user,
			settlements: settlementsWithTotals
		};
	} catch (err) {
		console.error('Error loading user settlements:', err);
		throw error(500, 'Failed to load settlements');
	}
};
