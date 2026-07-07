<script lang="ts">
	import { NavBarData } from "./linkUtils.svelte";
	import { goto } from "$app/navigation";
	import { House } from "lucide-svelte";

	interface Props {
		navBarData: NavBarData;
	}

	let { navBarData }: Props = $props();

	function handleClick(link: string) {
		navBarData.curLink = link;
	}
</script>

<nav class="w-full flex justify-between items-center">
	<div class="flex-col justify-center items-center mx-10">
		<button
			onclick={() => {
				handleClick("/");
				goto("/");
			}}
		>
			<House class="cursor-pointer" size="40px" />
		</button>
	</div>

	<div class="flex">
		{#each navBarData.links as link}
			<a
				class="flex flex-col justify-center items-center h-16 w-32 text-lg cursor-pointer {link.url ==
				navBarData.curLink
					? 'text-green-200 border-b-4'
					: 'text-white '}"
				href={link.url}
				onclick={() => handleClick(link.url)}
			>
				<p>{link.linkText}</p>
			</a>
		{/each}
	</div>
</nav>
