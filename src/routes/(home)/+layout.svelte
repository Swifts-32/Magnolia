<script>
	import { page } from "$app/state";
	import NavBar from "$lib/components/NavBar/NavBar.svelte";
	import { NavBarData } from "../../lib/components/NavBar/linkUtils.svelte";

	let { children } = $props();

	const curLink = page.url.pathname;
	const links = [
		{
			linkText: "Home",
			url: "/",
			displayInNav: true,
			displayInFooter: false,
		},
		{
			linkText: "Database",
			url: "/database",
			displayInNav: true,
			displayInFooter: false,
		},
	];

	const navbarData = new NavBarData(links, curLink);
</script>

<NavBar navBarData={navbarData} />
{@render children()}
