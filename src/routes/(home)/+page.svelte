<script lang="ts">
	import { createLayout, getLayouts } from "../(app)/layouts/layouts.remote";
	import { Plus } from "lucide-svelte";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import Fab from "$lib/components/FAB/Fab.svelte";
	import Button from "$lib/components/ui/button/button.svelte";

	let isDialogOpen = $state(false);
</script>

<svelte:head>
	<title>Magnolia</title>
</svelte:head>

<div class="mx-2 flex flex-wrap">
	<svelte:boundary>
		{#each await getLayouts() as layout}
			<a
				class="border-primary flex items-center justify-center border-2 p-2 rounded-md size-52 m-5 select-none"
				href={`/layouts/${layout.id}`}
			>
				<p class="text-3xl">{layout.name}</p>
			</a>
		{/each}

		{#snippet pending()}
			<p>loading...</p>
		{/snippet}

		{#snippet failed(error, reset)}
			<p>{error}</p>
			<Button onclick={reset}>Try Again</Button>
		{/snippet}
	</svelte:boundary>
</div>

<!-- Add Layout Button -->
<Fab onclick={() => (isDialogOpen = true)} label="Add Layout">
	<Plus class="size-8" />
</Fab>

<!-- Add Layout Dialog -->
<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create Layout</Dialog.Title>
		</Dialog.Header>

		<form {...createLayout}>
			<!-- Layout Name -->
			<label class="grid grid-cols-4 mt-2 mb-3 items-center gap-4">
				<p>Layout Name</p>
				<input
					class="border border-gray-300 col-span-3 rounded-md p-2 w-full"
					type="text"
					name="name"
					id="name"
					placeholder="New Layout"
					required
				/>
			</label>

			<Dialog.Footer>
				<Button
					type="reset"
					onclick={() => (isDialogOpen = false)}
					variant="destructive"
					class="w-32">Cancel</Button
				>
				<Button type="submit" class="w-32">Submit</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
