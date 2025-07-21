import { json } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';
import type { Spleis } from '$lib/types';
import { settlements, members, products, membersToProducts } from '$lib/db/schemas';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const spleis: Spleis = await request.json();
		const db = locals.db;
		const ownerId = locals.auth.user?.id;
		if (!ownerId) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Validate required fields
		if (!spleis.name || !spleis.name.trim()) {
			return json({ error: 'Name is required' }, { status: 400 });
		}

		if (!spleis.members || spleis.members.length < 2) {
			return json({ error: 'At least 2 members are required' }, { status: 400 });
		}

		if (!spleis.products || spleis.products.length === 0) {
			return json({ error: 'At least 1 product is required' }, { status: 400 });
		}

		// Validate that all products have assignments
		const hasUnassignedProducts = spleis.products.some(
			(product) => !spleis.assignments[product.id] || spleis.assignments[product.id].length === 0
		);

		if (hasUnassignedProducts) {
			return json(
				{ error: 'All products must be assigned to at least one member' },
				{ status: 400 }
			);
		}

		// Validate that all assigned members exist
		const memberIds = new Set(spleis.members.map((m) => m.id));
		const allAssignedMemberIds = Object.values(spleis.assignments).flat();
		const invalidMemberIds = allAssignedMemberIds.filter((id) => !memberIds.has(id));

		if (invalidMemberIds.length > 0) {
			return json({ error: 'Invalid member assignments found' }, { status: 400 });
		}

		const settlementId = nanoid();

		// Create the settlement
		await db.insert(settlements).values({
			id: settlementId,
			name: spleis.name.trim(),
			description: spleis.description?.trim() || null,
			owner: ownerId,
			isPublic: spleis.isPublic
		});

		// Create members
		const memberInserts = spleis.members.map((member) => ({
			id: member.id,
			name: member.name,
			settlementId
		}));
		await db.insert(members).values(memberInserts);

		// Create products (convert price to cents for integer storage)
		const productInserts = spleis.products.map((product) => ({
			id: product.id,
			name: product.name,
			price: Math.round(product.price * 100), // Store as cents
			settlementId
		}));
		await db.insert(products).values(productInserts);

		// Create member-product assignments
		const assignmentInserts: Array<{ memberId: string; productId: string }> = [];
		for (const [productId, memberIds] of Object.entries(spleis.assignments)) {
			for (const memberId of memberIds) {
				assignmentInserts.push({ memberId, productId });
			}
		}

		// Insert assignments only if there are any
		if (assignmentInserts.length > 0) {
			await db.insert(membersToProducts).values(assignmentInserts);
		}

		return json(
			{
				success: true,
				spleis: {
					id: settlementId,
					name: spleis.name,
					description: spleis.description,
					isPublic: spleis.isPublic,
					createdAt: new Date().toISOString(),
					members: spleis.members,
					products: spleis.products,
					assignments: spleis.assignments
				},
				message: 'Spleis created successfully'
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating spleis:', error);
		return json({ error: 'Failed to create spleis' }, { status: 500 });
	}
};
