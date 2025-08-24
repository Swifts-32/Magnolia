import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ params }) => {
    return redirect(307, `/layouts/${params.id}/settings/layout`);
}) satisfies PageServerLoad;