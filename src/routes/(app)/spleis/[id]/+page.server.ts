import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { settlements, members, products, membersToProducts } from '$lib/db/schemas';

export const load: PageServerLoad = async ({ params, locals }) => {
	try {
		// Fetch the settlement
		const settlement = await locals.db
			.select()
			.from(settlements)
			.where(eq(settlements.id, params.id))
			.limit(1);

		if (settlement.length === 0) {
			throw error(404, 'Spleis not found');
		}

		const spleis = settlement[0];

		if (!spleis.isPublic && locals.auth.user?.id !== spleis.owner) {
			throw error(403, 'Access denied to this spleis');
		}

		// Fetch members
		const spleisMembers = await locals.db
			.select()
			.from(members)
			.where(eq(members.settlementId, params.id));

		// Fetch products
		const spleisProducts = await locals.db
			.select()
			.from(products)
			.where(eq(products.settlementId, params.id));

		// Fetch member-product assignments
		const assignments = await locals.db
			.select()
			.from(membersToProducts)
			.innerJoin(products, eq(membersToProducts.productId, products.id))
			.where(eq(products.settlementId, params.id));

		// Transform assignments into the expected format
		const assignmentsMap: Record<string, string[]> = {};
		for (const assignment of assignments) {
			const productId = assignment.members_to_products.productId;
			const memberId = assignment.members_to_products.memberId;

			if (!assignmentsMap[productId]) {
				assignmentsMap[productId] = [];
			}
			assignmentsMap[productId].push(memberId);
		}

		const productsWithPrice = spleisProducts.map((product) => ({
			...product,
			price: product.price / 100 // Convert from cents back to decimal
		}));

		// Calculate member costs
		const memberCosts = spleisMembers.map((member) => {
			const assignedProducts = productsWithPrice.filter((product) =>
				assignmentsMap[product.id]?.includes(member.id)
			);

			const totalCost = assignedProducts.reduce((sum, product) => {
				const assignedMemberCount = assignmentsMap[product.id]?.length || 1;
				return sum + product.price / assignedMemberCount;
			}, 0);

			return {
				memberId: member.id,
				memberName: member.name,
				totalCost: Number(totalCost.toFixed(2)),
				assignedProducts: assignedProducts.map((p) => ({
					productId: p.id,
					productName: p.name,
					totalPrice: p.price,
					memberShare: Number((p.price / (assignmentsMap[p.id]?.length || 1)).toFixed(2))
				}))
			};
		});

		const totalAmount = productsWithPrice.reduce((sum, product) => sum + product.price, 0);

		return {
			spleis: {
				id: spleis.id,
				name: spleis.name,
				description: spleis.description,
				isPublic: spleis.isPublic,
				createdAt: spleis.createdAt,
				owner: spleis.owner,
				totalAmount: Number(totalAmount.toFixed(2)),
				members: spleisMembers,
				products: productsWithPrice,
				assignments: assignmentsMap,
				memberCosts
			}
		};
	} catch (err) {
		console.error('Error loading spleis:', err);
		if (err instanceof Error && err.message.includes('not found')) {
			throw error(404, 'Spleis not found');
		}
		throw error(500, 'Failed to load spleis');
	}
};
