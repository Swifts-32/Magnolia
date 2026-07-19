<script lang="ts">
	import { page } from "$app/state";
	import {
		NavBarData,
		type navbarItemData,
	} from "$lib/components/NavBar/linkUtils.svelte";
	import NavBar from "$lib/components/NavBar/NavBar.svelte";
	import { Toaster } from "svelte-sonner";
	import type { LayoutProps } from "./$types";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "$lib/components/Sidebar/AppSidebar.svelte";
    import { getLayout } from "$lib/client/layouts.remote";

	let { children }: LayoutProps = $props();

	const curLink = page.url.pathname;
	const links: navbarItemData[] = [
		{
			linkText: "Home",
			url: `/layouts/${page.params.id}`,
		},
		{
			linkText: "Throttle",
			url: `/layouts/${page.params.id}/throttle`,
		},
		{
			linkText: "Connections",
			url: `/layouts/${page.params.id}/connections`,
		},
		{
			linkText: "Trains",
			url: `/layouts/${page.params.id}/trains`,
		},
		{
			linkText: "Panel",
			url: `/layouts/${page.params.id}/panel`,
		},
		{
			linkText: "Settings",
			url: `/layouts/${page.params.id}/settings`,
		},
	];

	const navBarData = new NavBarData(links, curLink);
</script>

<svelte:boundary>
	<Sidebar.Provider>
		<AppSidebar layoutName={(await getLayout(page.params.id)).name} />

		<div class="flex flex-1 flex-col overflow-hidden">
			<header
				class="flex h-12 items-center gap-4 border-b border-sidebar-border bg-background px-4"
			>
				<Sidebar.Trigger class="-ms-1" />
				<!-- <div class="h-4 w-px bg-sidebar-border"></div> -->
				<!-- <span class="text-sm font-medium text-muted-foreground"
					></span
				> -->
			</header>

			<main class="flex-1 overflow-y-auto p-6">
				{@render children?.()}
			</main>
		</div>
	</Sidebar.Provider>

	{#snippet pending()}
		<div class="fixed inset-0 bg-black/50 flex items-center justify-center">
			<div
				class="h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin"
			></div>
		</div>
	{/snippet}

	{#snippet failed(error, reset)}
		<p>Error: {error}</p>
		<Button onclick={reset}>Try again</Button>
	{/snippet}
	<Toaster richColors theme="dark" position="bottom-left" />
</svelte:boundary>
