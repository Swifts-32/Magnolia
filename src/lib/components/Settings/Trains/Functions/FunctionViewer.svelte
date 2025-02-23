<script lang="ts">
	import { TrainClientFunction } from "$lib/client/Trains/Functions/Function.svelte";
	import Check from "lucide-svelte/icons/check";
	import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
	import { onMount, tick } from "svelte";
	import * as Command from "$lib/components/ui/command/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import { cn } from "$lib/utils.js";
	import Label from "$lib/components/ui/label/label.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Select from "$lib/components/ui/select/index.js";

	import {
		TrainFunctionIconsList,
		TrainFunctionModesList,
		type TrainFunctionIcons,
		type TrainFunctionModes,
	} from "$lib/types/Trains/Functions/Functions";
	import { Bell, Lightbulb, Sun, Text, Volume2 } from "lucide-svelte";

	interface Props {
		functions: Map<string, TrainClientFunction>;
	}

	let { functions }: Props = $props();

	let editedFunctions: Map<string, TrainClientFunction> = $state(functions);
	let selectedFunctionValue: string = $state("");
	let selectedFunction: TrainClientFunction | undefined = $derived(
		editedFunctions.get(selectedFunctionValue),
	);

	let functionSelectorOpen = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);


	// Function Editor Properties
	let functionName: string = $state("");
	let functionValue: string = $state("");
	let functionIcon: TrainFunctionIcons = $state("Text");
	let functionMode: TrainFunctionModes = $state("Toggle");
	let functionVisible: boolean = $state(true);
	let functionPosition: number = $state(0);

	// Update the function editor properties when a function is selected
	function selectedFunctionChanged() {
		// Save editor changes to the selected function
		if (selectedFunction) {
			let editedFunction = new TrainClientFunction(
				functionValue,
				functionName,
				functionIcon,
				functionMode,
				functionPosition,
			);
			editedFunction.visible = functionVisible;

			editedFunctions.set(editedFunction.value, editedFunction);
		}

		if (selectedFunction) {
			functionName = selectedFunction.name;
			functionValue = selectedFunction.value;
			functionIcon = selectedFunction.icon;
			functionMode = selectedFunction.mode;
			functionVisible = selectedFunction.visible;
			functionPosition = selectedFunction.position;
		}
	}
</script>

<!-- Function Selector -->
<div class="my-2 mb-5 items-center gap-4 w-full">
	<Popover.Root bind:open={functionSelectorOpen}>
		<Popover.Trigger bind:ref={triggerRef} class="w-full flex justify-between">
			{#snippet child({ props })}
				<Button
					variant="outline"
					class="w-full"
					{...props}
					role="combobox"
					aria-expanded={functionSelectorOpen}
				>
					{selectedFunction?.name || "Select a function"}
					<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="p-0 w-80">
			<Command.Root>
				<Command.Input placeholder="Type to search a function" />
				<Command.Empty>No functions found.</Command.Empty>
				<Command.List>
					<Command.Group>
						{#each Array.from(functions.values()) as funct}
							<Command.Item
								class={selectedFunctionValue !== funct.value
									? "cursor-pointer"
									: "cursor-default"}
								value={funct.value}
								keywords={[funct.name]}
								onclick={() => {
									selectedFunctionValue = funct.value;
									selectedFunctionChanged();
									functionSelectorOpen = false;
								}}
							>
								{funct.name}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
</div>

{#snippet functionIcons(icon: TrainFunctionIcons)}
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
		<p class="text-md ml-2">{icon}</p>
	</div>
{/snippet}

<!-- Function Editor -->
{#key selectedFunction}
	{#if selectedFunction}
		<!-- Function Name -->
		<div class="grid grid-cols-4 my-2 items-center gap-4 w-full">
			<Label for="functionName" class="text-right">Name</Label>
			<Input id="functionName" bind:value={functionName} class="col-span-3" />
		</div>

		<!-- Function Value -->
		<div class="grid grid-cols-4 my-2 items-center gap-4 w-full">
			<Label for="functionValue" class="text-right">Value</Label>
			<Input id="functionValue" bind:value={functionValue} class="col-span-3" />
		</div>

		<!-- Function Position -->
		<div class="grid grid-cols-4 my-2 items-center gap-4 w-full">
			<Label for="functionPosition" class="text-right">Position</Label>
			<Input
				id="functionPosition"
				bind:value={functionPosition}
				class="col-span-3"
			/>
		</div>

		<!-- Function Icon -->
		<div class="grid grid-cols-4 my-2 items-center gap-4 w-full">
			<Label for="functionIcon" class="text-right">Icon</Label>
			<Select.Root type="single" name="functionIcon" bind:value={functionIcon}>
				<Select.Trigger class="col-span-3">
					{@render functionIcons(functionIcon)}
				</Select.Trigger>
				<Select.Content>
					{#each TrainFunctionIconsList as icon}
						<Select.Item
							value={icon}
							class={icon === functionIcon
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
		<div class="grid grid-cols-4 my-2 items-center gap-4 w-full">
			<Label for="functionMode" class="text-right">Mode</Label>
			<Select.Root type="single" name="functionMode" bind:value={functionMode}>
				<Select.Trigger class="col-span-3">
					{functionMode}
				</Select.Trigger>
				<Select.Content>
					{#each TrainFunctionModesList as mode}
						<Select.Item
							value={mode}
							class={mode === functionMode
								? "cursor-default"
								: "cursor-pointer"}
						>
							{mode}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	{/if}
{/key}

<Button
	class="w-full"
	onclick={() => {
		const newFunction = new TrainClientFunction(
			"",
			"New Function",
			"Text",
			"Toggle",
			0,
		);
		functions.set(newFunction.value, newFunction);
		selectedFunctionValue = newFunction.value;
		selectedFunctionChanged();
	}}>Add Function</Button
>
