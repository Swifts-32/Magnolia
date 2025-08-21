<script lang="ts">
	import type { PageProps } from "./$types";
	import LayoutAdd from "$lib/components/Settings/Layouts/LayoutAdd.svelte";

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Magnolia</title>
</svelte:head>

<div class="mx-2 flex flex-wrap justify-center">
	{#each data.layouts as layout (layout.id)}
		<a
			class="border-primary flex items-center justify-center border-2 p-2 rounded-md size-52 m-5 select-none"
			href={`/layouts/${layout.id}`}
		>
			<p class="text-3xl">{layout.name}</p>
		</a>
	{/each}

	<LayoutAdd />
</div>
