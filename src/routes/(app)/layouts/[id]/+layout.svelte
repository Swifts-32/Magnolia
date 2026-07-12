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
	<div class="flex flex-col h-dvh">
		<NavBar {navBarData} />
		{@render children()}
	</div>

	<Toaster richColors theme="dark" position="bottom-left" />

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
</svelte:boundary>
