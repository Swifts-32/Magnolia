<script>
	import { page } from "$app/state";
	import { NavBarData } from "$lib/components/NavBar/linkUtils.svelte";
	import NavBar from "$lib/components/NavBar/NavBar.svelte";
    import { Toaster } from "svelte-sonner";

	let { children } = $props();

	const curLink = page.url.pathname;
	const links = [
		{
			linkText: "Home",
			url: "/",
		},
		// {
		// 	linkText: "Login",
		// 	url: "/login",
		// },
	];

	const navbarData = new NavBarData(links, curLink);
</script>

<NavBar navBarData={navbarData} />
{@render children()}
<Toaster theme="dark" position="bottom-left" richColors={true}/>
