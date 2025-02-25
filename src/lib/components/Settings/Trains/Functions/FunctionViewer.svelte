<script lang="ts">
	import { TrainClientFunction } from "$lib/client/Trains/Functions/Function.svelte";
	import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
	import * as Command from "$lib/components/ui/command/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import Label from "$lib/components/ui/label/label.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Select from "$lib/components/ui/select/index.js";
	import {
		TrainFunctionIconsList,
		TrainFunctionModesList,
		type TrainFunctionIcons,
	} from "$lib/types/Trains/Functions/Functions";
	import {
		Bell,
		Check,
		Lightbulb,
		Plus,
		Sun,
		Text,
		Trash2,
		Volume2,
	} from "lucide-svelte";

	interface Props {
		functions: Map<string, TrainClientFunction>;
	}

	let { functions = $bindable() }: Props = $props();

	let selectedFunctionValue: string | undefined = $state();
	let selectedFunction: TrainClientFunction | undefined = $derived.by(() => {
		if (!selectedFunctionValue) return undefined;

		return functions.get(selectedFunctionValue);
	});

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
						{selectedFunction.name}
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
								class="{selectedFunctionValue === funct.value
									? 'cursor-default'
									: 'cursor-pointer'}
								 py-1 px-2"
								value={funct.value}
								keywords={[funct.name]}
								onclick={() => {
									if (selectedFunctionValue !== funct.value) {
										// If not already selected, select it
										selectedFunctionValue = funct.value;
										functionSelectorOpen = false;

										console.log("Selecting Function");
									}
								}}
							>
								{#if selectedFunctionValue === funct.value}
									<Check size={10} />
								{:else}
									<div class="w-4" />
								{/if}
								{@render functionIcons(funct.icon, false)}
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

	<!-- Add Function -->
	<Button
		class="w-full col-span-3"
		variant="outline"
		onclick={() => {
			let newFunction = new TrainClientFunction(
				"1",
				"New Function",
				"Text",
				"Toggle",
				0,
			);
			// Select a function value (numerical) that is not already in use
			let i = 0;
			while (functions.has(`${i}`)) {
				i++;
			}
			newFunction.value = `${i}`;
			newFunction.name = `${newFunction.name} ${i}`;

			functions.set(newFunction.value, newFunction);
			selectedFunctionValue = newFunction.value;
			functionSelectorOpen = false;
		}}><Plus />Add Function</Button
	>
</div>

{#snippet functionIcons(icon: TrainFunctionIcons, text: boolean = true)}
	<div class="flex items-center">
		{#if icon === "Bell"}
			<Bell size={18} />
		{:else if icon === "Speaker"}
			<Volume2 size={18} />
		{:else if icon === "Light1"}
			<Lightbulb size={18} />
		{:else if icon === "Light2"}
			<Sun size={18} />
		{:else if icon === "Text"}
			<Text size={18} />
		{/if}

		{#if text}
			<p class="text-md ml-2">{icon}</p>
		{/if}
	</div>
{/snippet}

<!-- Function Editor -->
{#if selectedFunction}
	{#key selectedFunction}
		<div class="flex flex-col gap-2">
			<!-- Function Name -->
			<div class="grid grid-cols-4 items-center gap-4 w-full">
				<Label for="functionName" class="text-right">Name</Label>
				<Input
					id="functionName"
					bind:value={selectedFunction.name}
					class="col-span-3"
				/>
			</div>

			<!-- Function Value -->
			<div class="grid grid-cols-4 items-center gap-4 w-full">
				<Label for="functionValue" class="text-right">Value</Label>
				<Input
					id="functionValue"
					bind:value={selectedFunction.value}
					class="col-span-3"
				/>
			</div>

			<!-- Function Position -->
			<div class="grid grid-cols-4 items-center gap-4 w-full">
				<Label for="functionPosition" class="text-right">Position</Label
				>
				<Input
					id="functionPosition"
					bind:value={selectedFunction.position}
					class="col-span-3"
				/>
			</div>

			<!-- Function Icon -->
			<div class="grid grid-cols-4 items-center gap-4 w-full">
				<Label for="functionIcon" class="text-right">Icon</Label>
				<Select.Root
					type="single"
					name="functionIcon"
					bind:value={selectedFunction.icon}
				>
					<Select.Trigger class="col-span-3">
						{@render functionIcons(selectedFunction.icon)}
					</Select.Trigger>
					<Select.Content>
						{#each TrainFunctionIconsList as icon}
							<Select.Item
								value={icon}
								class={icon === selectedFunction.icon
									? "cursor-default"
									: "cursor-pointer"}
							>
								{@render functionIcons(icon)}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Function Mode -->
			<div class="grid grid-cols-4 items-center gap-4 w-full">
				<Label for="functionMode" class="text-right">Mode</Label>
				<Select.Root
					type="single"
					name="functionMode"
					bind:value={selectedFunction.mode}
				>
					<Select.Trigger class="col-span-3">
						{selectedFunction.mode}
					</Select.Trigger>
					<Select.Content>
						{#each TrainFunctionModesList as mode}
							<Select.Item
								value={mode}
								class={mode === selectedFunction.mode
									? "cursor-default"
									: "cursor-pointer"}
							>
								{mode}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Delete Function -->
			<!-- TODO Add conformation dialog -->
			<Button
				class="w-full mt-1"
				variant="destructive"
				onclick={() => {
					functions.delete(selectedFunction.value);
					selectedFunctionValue = undefined;
				}}
				><Trash2 /> Delete Function
			</Button>
		</div>
	{/key}
{/if}
