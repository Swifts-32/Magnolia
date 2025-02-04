import { EditMode } from "$lib/components/canvas/canvasTypes.svelte";
import { gStore } from "$lib/components/canvas/cellStore.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
    gStore.mode = new EditMode(null, 90);
}