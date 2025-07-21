import type { users } from '$lib/db/schemas';
import type { InferSelectModel } from 'drizzle-orm';

type User = InferSelectModel<typeof users>;

class UserState {
	#user = $state<User | null>(null);

	get current() {
		return this.#user;
	}

	set(newUser: User | null) {
		this.#user = newUser;
	}
}

export const user = new UserState();
