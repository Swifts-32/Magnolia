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
	import type { Snippet } from "svelte";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";

	interface Props {
		trainId: string;
		funct: TrainFunction;
		children: Snippet;
	}

	let { trainId, funct, children }: Props = $props();

	let open = $state(false);
	function onOpenChange() {}
</script>

<!-- Function Editor -->
<Dialog.Root bind:open {onOpenChange}>
	<Dialog.Trigger>
		{@render children()}
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Title>Edit Function</Dialog.Title>
		<div class="flex flex-col gap-2">
			<!-- Function Name -->
			<div class="grid grid-cols-4 items-center gap-4 w-full">
				<Label for="functionName" class="text-right">Name</Label>
				<Input
					id="functionName"
					class="col-span-3"
				/>
			</div>

			<!-- Function Value -->
			<!-- <div class="grid grid-cols-4 items-center gap-4 w-full">
			<Label for="functionValue" class="text-right">Value</Label>
			<Input
				id="functionValue"
				bind:value={selFunction.functValue}
				class="col-span-3"
			/>
		</div> -->

			<!-- Function Position -->
			<!-- <div class="grid grid-cols-4 items-center gap-4 w-full">
			<Label for="functionPosition" class="text-right">Position</Label>
			<Input
				id="functionPosition"
				bind:value={selFunction.position}
				class="col-span-3"
			/>
		</div> -->

			<!-- Function Icon -->
			<!-- <div class="grid grid-cols-4 items-center gap-4 w-full">
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
		</div> -->

			<!-- Function Mode -->
			<!-- <div class="grid grid-cols-4 items-center gap-4 w-full">
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
		</div> -->

			<!-- Delete Function Dialog -->
			<AlertDialog.Root>
				<AlertDialog.Trigger>
					<Button class="w-full mb-3" variant="destructive">
						<Trash2 />Delete Function
					</Button>
				</AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
						<AlertDialog.Description>
							This action cannot be undone. Are you sure you want to delete this
							function?
						</AlertDialog.Description>
					</AlertDialog.Header>

					<AlertDialog.Footer>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
						<Dialog.Close>
							<AlertDialog.Action
								onclick={async () =>
									await deleteTrainFunction({
										trainId,
										value: funct.functValue,
									})}>Delete Function</AlertDialog.Action
							>
						</Dialog.Close>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>

		<Dialog.Footer>
			<Dialog.Close>
				<Button type="reset" class="w-28" variant="outline">Cancel</Button>
			</Dialog.Close>
			<Button type="submit" form="edit-train-function-form" class="w-28"
				>Save</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
