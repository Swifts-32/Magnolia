import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { type LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { redirect } from "@sveltejs/kit";
import { layoutClientHandler } from "../../../../services/Layouts/LayoutClientHandler.svelte";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ params, fetch }) => {
    const { id } = params;

    const layout = layoutClientHandler.layouts.get(id as LayoutUUID);
    if (!layout) return redirect(300, "/");


    if (browser) {
        layout.createSSE();
    }

    return {
        layout
    };
}
