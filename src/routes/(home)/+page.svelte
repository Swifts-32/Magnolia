<script lang="ts">
	import { getLayouts } from "../(app)/layouts/layouts.remote";
	import { Plus } from "lucide-svelte";
	import Fab from "$lib/components/FAB/Fab.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import AddLayoutDialog from "$lib/components/Layout/AddLayoutDialog.svelte";
</script>

<!-- Add Layout Button -->
<AddLayoutDialog>
	<Fab label="Add Layout">
		<Plus class="size-8" />
	</Fab>
</AddLayoutDialog>

{#snippet layoutButton(layout: { id: string; name: string })}
	<a
		class="border-primary flex items-center justify-center border-2 p-2 rounded-md size-52 m-5 select-none"
		href={`/layouts/${layout.id}`}
	>
		<p class="text-3xl">{layout.name}</p>
	</a>
{/snippet}

<div class="mx-2 flex flex-wrap">
	<svelte:boundary>
		{#each await getLayouts() as layout}
			{@render layoutButton(layout)}
		{/each}

		{#snippet pending()}
			<div
				class="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
			>
				<div
					class="h-12 w-12 border-4 border-white/30 border-t-white rounded-full animate-spin"
				></div>
			</div>
		{/snippet}

		{#snippet failed(error, reset)}
			<p>{error}</p>
			<Button onclick={reset}>Try Again</Button>
		{/snippet}
	</svelte:boundary>
</div>
