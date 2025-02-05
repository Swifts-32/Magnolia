import { browser } from "$app/environment";
import { LayoutClient } from "$lib/client/LayoutClient.svelte";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ params, fetch }) => {
    const { id } = params;

    const Layout = await LayoutClient.create(id, fetch);

    if (browser) {
        Layout.createSSE();
    }

    return {
        Layout
    };
}
