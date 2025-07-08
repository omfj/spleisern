// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

type Authed = {
	user: import('./lib/db/schemas').User;
	session: import('./lib/db/schemas').Session;
};

type Unauthed = {
	user: null;
	session: null;
};

declare global {
	namespace App {
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}

		interface Locals {
			db: import('./lib/db/drizzle').Database;
			mistral: import('@mistralai/mistralai').Mistral;

			auth: Authed | Unauthed;
		}
	}
}

export {};
