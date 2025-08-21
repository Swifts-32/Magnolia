// See https://kit.svelte.dev/docs/types#app

import type { Session } from "$lib/server/db/schema/sessions";
import type { User } from "$lib/server/db/schema/users";
import type { ZodUUID } from "zod/v4";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
			sessionId: string | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
