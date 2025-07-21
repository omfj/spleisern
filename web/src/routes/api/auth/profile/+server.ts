import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const userId = locals.auth.user?.id;

	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	const user = await locals.db.query.users.findFirst({
		where: (t, { eq }) => eq(t.id, userId)
	});

	if (!user) {
		return new Response('User not found', { status: 404 });
	}

	return Response.json({
		id: user.id,
		name: user.name
	});
};
