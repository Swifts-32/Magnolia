<script lang="ts">
	import Fab from "#lib/components/FAB/Fab.svelte";
	import Button from "#lib/components/ui/button/button.svelte";
	import * as Dialog from "#lib/components/ui/dialog/index.js";
	import { toast } from "svelte-sonner";
	import { createLayout, getLayouts } from "#lib/client/layouts.remote.js";
	import { Plus } from "@lucide/svelte";

	let open = $state(false);
	const layouts = await getLayouts();
</script>

<!-- Add Layout Dialog -->
<Dialog.Root
	bind:open
	onOpenChange={(v) => {
		if (!v) {
			createLayout.element?.reset();
		}
	}}
>
	<!-- Add Layout FAB -->
	<Dialog.Trigger>
		<Fab label="Add Layout">
			<Plus class="size-8" />
		</Fab>
	</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-5/6 w-fit min-w-lg max-h-9/10">
		<Dialog.Header>
			<Dialog.Title>Create Layout</Dialog.Title>
		</Dialog.Header>

		<form
			{...createLayout}
			oninput={() => createLayout.validate()}
			{...createLayout.enhance(async (form) => {
				try {
					if (await form.submit()) {
						form.element.reset();

						toast.success("Created Layout");
						open = false;
					} else {
						toast.error("Invalid data");
					}
				} catch (error) {
					toast.error("Something went wrong. Please try again.");
				}
			})}
		>
			<!-- Layout Name -->
			<label class="grid grid-cols-4 mt-2 mb-3 items-center gap-4">
				<p>Layout Name</p>
				<div class="col-span-3">
					<input
						class="border rounded-md p-2 w-full {createLayout.fields.issues()
							? 'border-red-600 focus:border-red-600'
							: 'border-gray-300'}"
						id="name"
						{...createLayout.fields.name.as("text")}
					/>
					{#each createLayout.fields.name.issues() as issue}
						<p class="text-xs text-red-600">{issue.message}</p>
					{/each}
				</div>
			</label>

			<Dialog.Footer>
				<Dialog.Close>
					<Button type="reset" variant="outline" class="w-32">Cancel</Button>
				</Dialog.Close>
				<Button type="submit" class="w-32">Create</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<main class="mx-2">
	<h1 class="text-4xl font-medium text-center p-10">Select Your Layout</h1>

	<div class="flex flex-wrap">
		<svelte:boundary>
			{#each layouts as layout}
				<a
					class="border-primary flex items-center justify-center border-2 p-2 rounded-md size-52 m-5 select-none"
					href={`/layouts/${layout.id}`}
				>
					<p class="text-3xl">{layout.name}</p>
				</a>
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
</main>
