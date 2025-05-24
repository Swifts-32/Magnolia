import type { LayoutUUID } from "$lib/client/LayoutClient.svelte";
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = ({ params }) => {
  return {
    layoutId: params.id as LayoutUUID,
  }
};