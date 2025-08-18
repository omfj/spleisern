import { error } from '@sveltejs/kit';
import { eq, desc, countDistinct, getTableColumns, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { settlements, members, products } from '$lib/db/schemas';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.auth.user;
	if (!user) {
		error(401, 'Unauthorized');
	}

	try {
		const settlementsWithTotals = await locals.db
			.select({
				...getTableColumns(settlements),
				memberCount: countDistinct(members.id),
				productCount: countDistinct(products.id),
				totalAmount: sql`COALESCE(SUM(DISTINCT ${products.price}) / 100.0, 0)`.as('totalAmount')
			})
			.from(settlements)
			.leftJoin(members, eq(members.settlementId, settlements.id))
			.leftJoin(products, eq(products.settlementId, settlements.id))
			.where(eq(settlements.owner, user.id))
			.groupBy(settlements.id)
			.orderBy(desc(settlements.createdAt));

		return {
			user,
			settlements: settlementsWithTotals
		};
	} catch (err) {
		console.error('Error loading user settlements:', err);
		throw error(500, 'Failed to load settlements');
	}
};
