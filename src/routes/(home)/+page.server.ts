import { db } from '$lib/server/db';
import { LayoutTable } from '$lib/server/db/schema/layouts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async () => {
  const layouts = await db.select({
    id: LayoutTable.uuid,
    name: LayoutTable.name,
  }).from(LayoutTable);

  return {
    layouts
  };
}) satisfies PageServerLoad;