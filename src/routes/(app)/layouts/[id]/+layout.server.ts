import type { LayoutServerLoad } from "./$types";
import { getLayout } from "../layouts.remote";

export const load: LayoutServerLoad = async ({ params }) => {
  const { id } = params;

  // Check that this is a valid layout
  const layout = await getLayout(id);

  return layout;
}