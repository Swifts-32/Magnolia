<script lang="ts">
	import {
		createDefaultTrainFunction,
		deleteTrainFunction,
		getTrainFunctions,
	} from "../../../../../routes/(app)/layouts/[id]/settings/trains/trainFunctions.remote";
	import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
	import * as Command from "$lib/components/ui/command/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import Button from "$lib/components/ui/button/button.svelte";
	import { Check, Plus } from "lucide-svelte";
	import FunctionIcons from "./FunctionIcons.svelte";
	import type { TrainFunction } from "$lib/server/db/schema/trains";
	import Label from "$lib/components/ui/label/label.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Trash2 } from "lucide-svelte";
	import {
		TrainFunctionIconsList,
		TrainFunctionModesList,
	} from "$lib/types/Trains/Functions/Functions";
	import ConformationDialog from "../../Common/ConformationDialog/ConformationDialog.svelte";

	interface Props {
		trainId: string;
	}

	let { trainId }: Props = $props();

	let selFunction: TrainFunction | undefined = $state();
	let isSelOpen = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	async function deleteFunction() {
		if (selFunction) {
			await deleteTrainFunction({
				value: selFunction.functValue,
				trainId: selFunction.trainUuid,
			});
			selFunction = undefined;
		}
	}
</script>

<div class="my-2 mb-5 items-center gap-4 w-full grid grid-cols-8">
	<Popover.Root bind:open={isSelOpen}>
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
					aria-expanded={isSelOpen}
				>
					{#if selFunction}
						<div class="flex gap-2 align-middle">
							<FunctionIcons
								selectedIcon={selFunction.icon}
								size={18}
								text={false}
							/>
							{selFunction.name}
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
						{#each Array.from((await getTrainFunctions(trainId)).values()).sort( (a, b) => a.functValue.localeCompare(b.functValue), ) as funct}
							<Command.Item
								class="{selFunction?.functValue === funct.functValue
									? 'cursor-default'
									: 'cursor-pointer'}
								 py-1 px-2"
								value={funct.functValue}
								keywords={[funct.name]}
								onclick={() => {
									if (selFunction?.functValue !== funct.functValue) {
										// If not already selected, select it
										selFunction = funct;
										isSelOpen = false;
									}
								}}
							>
								{#if selFunction?.functValue === funct.functValue}
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
										Value: {funct.functValue}
									</p>
								</div>
							</Command.Item>
						{/each}
						<!-- {/if} -->
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>

	<!-- Add Function Button -->
	<Button
		class="w-full col-span-3"
		variant="outline"
		onclick={async () => await createDefaultTrainFunction(trainId)}
	>
		<Plus />Add Function
	</Button>
</div>

<!-- Function Editor -->
{#if selFunction}
	<div class="flex flex-col gap-2">
		<!-- Function Name -->
		<div class="grid grid-cols-4 items-center gap-4 w-full">
			<Label for="functionName" class="text-right">Name</Label>
			<Input
				id="functionName"
				bind:value={selFunction.name}
				class="col-span-3"
			/>
		</div>

		<!-- Function Value -->
		<div class="grid grid-cols-4 items-center gap-4 w-full">
			<Label for="functionValue" class="text-right">Value</Label>
			<Input
				id="functionValue"
				bind:value={selFunction.functValue}
				class="col-span-3"
			/>
		</div>

		<!-- Function Position -->
		<div class="grid grid-cols-4 items-center gap-4 w-full">
			<Label for="functionPosition" class="text-right">Position</Label>
			<Input
				id="functionPosition"
				bind:value={selFunction.position}
				class="col-span-3"
			/>
		</div>

		<!-- Function Icon -->
		<div class="grid grid-cols-4 items-center gap-4 w-full">
			<Label for="functionIcon" class="text-right">Icon</Label>
			<Select.Root
				type="single"
				name="functionIcon"
				bind:value={selFunction.icon}
			>
				<Select.Trigger class="col-span-3">
					<FunctionIcons selectedIcon={selFunction.icon} size={18} />
				</Select.Trigger>
				<Select.Content>
					{#each TrainFunctionIconsList as icon}
						<Select.Item
							value={icon}
							class={icon === selFunction.icon
								? "cursor-default"
								: "cursor-pointer"}
						>
							<FunctionIcons selectedIcon={icon} size={18} />
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
				bind:value={selFunction.mode}
			>
				<Select.Trigger class="col-span-3">
					{selFunction.mode}
				</Select.Trigger>
				<Select.Content>
					{#each TrainFunctionModesList as mode}
						<Select.Item
							value={mode}
							class={mode === selFunction.mode
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
		<ConformationDialog title="Delete Function">
			{#snippet trigger()}
				<Button class="w-full mb-3" variant="destructive">
					<Trash2 />Delete Function
				</Button>
			{/snippet}
			{#snippet primaryButton()}
				<Button variant="destructive" class="w-32" onclick={async () => await deleteFunction()}>
					Delete Function</Button
				>
			{/snippet}
			{#snippet secondaryButton()}
				<Button variant="outline" class="w-32">Cancel</Button>
			{/snippet}
			<p>Are you sure you want to delete this function?</p>
		</ConformationDialog>
	</div>{/if}
