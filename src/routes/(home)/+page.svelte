<script lang="ts">
	import { getLayouts } from "../(app)/layouts/layouts.remote";
	import { Plus } from "lucide-svelte";
	import Fab from "$lib/components/FAB/Fab.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import AddLayoutDialog from "$lib/components/Layout/AddLayoutDialog.svelte";  
	import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
</script>

<svelte:head>
	<title>Magnolia</title>
</svelte:head>

<!-- Add Layout Button -->
<AddLayoutDialog>
	<Fab label="Add Layout">
		<Plus class="size-8" />
	</Fab>
</AddLayoutDialog>

<div class="mx-2 flex flex-wrap">
	<svelte:boundary>
		{#each await getLayouts() as layout}
			<ContextMenu.Root>
				<ContextMenu.Trigger>
					<a
								class="border-primary flex items-center justify-center border-2 p-2 rounded-md size-52 m-5 select-none"
								href={`/layouts/${layout.id}`}
							>
								<p class="text-3xl">{layout.name}</p>
							</a>  
				</ContextMenu.Trigger>
				<ContextMenu.Content class="w-52">
					<ContextMenu.Item inset>
						Delete
						<ContextMenu.Shortcut>Crtl + Del</ContextMenu.Shortcut>
					</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Root>
		{/each}

		{#snippet pending()}
			<p>Loading Layouts...</p>
		{/snippet}

		{#snippet failed(error, reset)}
			<p>{error}</p>
			<Button onclick={reset}>Try Again</Button>
		{/snippet}
	</svelte:boundary>
</div>
