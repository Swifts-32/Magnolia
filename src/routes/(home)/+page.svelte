<script lang="ts">
	import { goto } from "$app/navigation";
	import type { PageProps } from "./$types";
	import LayoutAdd from "$lib/components/Settings/Layouts/LayoutAdd.svelte";

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="mx-2 flex flex-wrap justify-center">
	{#each data.layouts as layout (layout.id)}
		<button
			class="border-primary border-2 p-2 rounded-md size-52 m-5 select-none"
			onclick={() => goto(`/layouts/${layout.id}`)}
		>
			<p class="text-3xl text-center">{layout.name}</p>
		</button>
	{/each}
	
	<LayoutAdd />
</div>
