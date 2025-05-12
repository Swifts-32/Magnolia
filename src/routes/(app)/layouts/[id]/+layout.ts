import { browser } from "$app/environment";
import { type LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { redirect } from "@sveltejs/kit";
import { layoutClientHandler } from "../../../../services/Layouts/LayoutClientHandler.svelte";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ params }) => {
    const { id } = params;

    const layout = layoutClientHandler.layouts.get(id as LayoutUUID);
    
    if (!layout || !browser) {
        redirect(307, "/");
    }

    return {
        layout
    };
}
