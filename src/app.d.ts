// See https://kit.svelte.dev/docs/types#app

import type { Session } from "$lib/server/db/schema/sessions";
import type { User } from "$lib/server/db/schema/users";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
