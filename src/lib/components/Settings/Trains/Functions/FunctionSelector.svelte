<script lang="ts">
	import { TrainClientFunction } from "$lib/client/Trains/Functions/Function.svelte";
	import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
	import * as Command from "$lib/components/ui/command/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import Button from "$lib/components/ui/button/button.svelte";
	import { Check, Plus } from "lucide-svelte";
	import FunctionIcons from "./FunctionIcons.svelte";

	interface Props {
		functions: Map<string, TrainClientFunction>;
		selectedFunction: TrainClientFunction | undefined;
		addFunction: () => void;
	}

	let {
		functions = $bindable(),
		selectedFunction = $bindable(),
		addFunction,
	}: Props = $props();

	let functionSelectorOpen = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

</script>

<div class="my-2 mb-5 items-center gap-4 w-full grid grid-cols-8">
	<!-- Function Selector -->
	<Popover.Root bind:open={functionSelectorOpen}>
		<Popover.Trigger
			bind:ref={triggerRef}
			class="w-full col-span-5 flex justify-between"
		>
			{#snippet child({ props })}
				<Button
					variant="outline"
					class="w-full"
					{...props}
					role="combobox"
					aria-expanded={functionSelectorOpen}
				>
					{#if selectedFunction}
						<div class="flex gap-2 align-middle">
							<FunctionIcons
								selectedIcon={selectedFunction.icon}
								size={18}
								text={false}
							/>
							{selectedFunction.name}
						</div>
					{:else}
						Select a function
					{/if}
					<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger>

		<!-- TODO Make Dynamic width -->
		<Popover.Content class="p-0 w-72">
			<Command.Root>
				<Command.Input placeholder="Type to search a function" />
				<Command.Empty>No functions found.</Command.Empty>
				<Command.List>
					<Command.Group>
						<!-- Sort the functions by value (Descending) -->
						{#each Array.from(functions.values()).sort( (a, b) => a.value.localeCompare(b.value), ) as funct}
							<Command.Item
								class="{selectedFunction?.value === funct.value
									? 'cursor-default'
									: 'cursor-pointer'}
								 py-1 px-2"
								value={funct.value}
								keywords={[funct.name]}
								onclick={() => {
									if (selectedFunction?.value !== funct.value) {
										// If not already selected, select it
										selectedFunction = funct;
										functionSelectorOpen = false;
									}
								}}
							>
								{#if selectedFunction?.value === funct.value}
									<Check size={10} />
								{:else}
									<div class="w-4"></div>
								{/if}
								<FunctionIcons
									selectedIcon={funct.icon}
									text={false}
									size={18}
								/>
								<div class="flex flex-col items-start">
									<p class="text-md">
										{funct.name}
									</p>
									<p class="text-xs">
										Value: {funct.value}
									</p>
								</div>
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>

	<!-- Add Function Button -->
	<Button
		class="w-full col-span-3"
		variant="outline"
		onclick={() => {
			functionSelectorOpen = false;
			addFunction();
		}}><Plus />Add Function</Button
	>
</div>
