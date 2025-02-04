import { LayoutClient } from "$lib/LayoutClient.svelte";
import type { PageLoad } from "../(app)/layouts/$types";
import { layoutClientHandler } from "../../services/Layouts/LayoutClientHandler";

export const load: PageLoad = async ({ fetch }) => {
    console.log("Fetching Layouts 2");
    layoutClientHandler.addLayouts(new Map(JSON.parse(await fetch("/api/layout").then(res => res.json()))));
}