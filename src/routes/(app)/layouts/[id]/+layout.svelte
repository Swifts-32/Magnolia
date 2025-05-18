<script lang="ts">
	import { page } from "$app/state";
	import { NavBarData } from "$lib/components/NavBar/linkUtils.svelte";
	import NavBar from "$lib/components/NavBar/NavBar.svelte";

	let { children } = $props();

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
</script>

<div class="flex flex-col h-dvh">
	<NavBar {navBarData} />
	{@render children()}
</div>


