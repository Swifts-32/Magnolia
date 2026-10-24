import { OperateMode } from "#lib/components/canvas/canvasTypes.svelte.js";
import { gStore } from "#lib/components/canvas/cellStore.svelte.js";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
    gStore.mode = new OperateMode();
}
