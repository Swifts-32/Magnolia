<script lang="ts">
	import { page } from "$app/state";
	import { NavBarData } from "$lib/components/NavBar/linkUtils.svelte";
	import NavBar from "$lib/components/NavBar/NavBar.svelte";
	import { Toaster } from "svelte-sonner";
	import type { LayoutProps } from "./$types";
	import Button from "$lib/components/ui/button/button.svelte";

	let { children }: LayoutProps = $props();

	const curLink = page.url.pathname;
	const links = [
		{
			linkText: "Home",
			url: `/layouts/${page.params.id}`,
			displayInNav: true,
			displayInFooter: false,
		},
		{
			linkText: "Throttle",
			url: `/layouts/${page.params.id}/throttle`,
			displayInNav: true,
			displayInFooter: false,
		},
		{
			linkText: "Panel",
			url: `/layouts/${page.params.id}/panel`,
			displayInNav: true,
			displayInFooter: false,
		},
		{
			linkText: "Settings",
			url: `/layouts/${page.params.id}/settings`,
			displayInNav: true,
			displayInFooter: false,
		},
	];

	const navBarData = new NavBarData(links, curLink);

	// This is causing page load error
	// createLayoutClientState(data.layoutId, data.layoutName);
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
		<p>Error: {error.message}</p>
		<Button onclick={reset}>Try again</Button>
	{/snippet}
</svelte:boundary>
