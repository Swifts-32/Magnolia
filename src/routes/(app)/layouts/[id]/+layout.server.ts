import { getLayout } from "$lib/client/layouts.remote";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params }) => {
  const { id } = params;

  // Check that this is a valid layout
  const layout = await getLayout(id);

  return layout;
}