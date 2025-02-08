import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ params }) => {
    throw redirect(307, `/layouts/${params.id}/settings/trains`);
}) satisfies PageServerLoad;