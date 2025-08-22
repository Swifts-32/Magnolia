<script lang="ts">
	import { TrainClientFunction } from "$lib/client/Trains/Functions/Function.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Trash2 } from "lucide-svelte";
	import {
		TrainFunctionIconsList,
		TrainFunctionModesList,
	} from "$lib/types/Trains/Functions/Functions";
	import FunctionIcons from "./FunctionIcons.svelte";
	import ConformationDialog from "../../Common/ConformationDialog/ConformationDialog.svelte";
    import type { TrainFunction } from "$lib/server/db/schema/trains";

	interface Props {
		selFunction: TrainFunction;
		deleteFunction: () => void;
	}

	let { selFunction, deleteFunction }: Props = $props();
</script>

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
			bind:value={selFunction.value}
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
			<Button class="w-full mt-1" variant="destructive">
				<Trash2 />Delete Function
			</Button>
		{/snippet}
		{#snippet primaryButton()}
			<Button variant="destructive" class="w-28" onclick={deleteFunction}
				>Delete Function</Button
			>
		{/snippet}
		{#snippet secondaryButton()}
			<Button variant="outline" class="w-28">Cancel</Button>
		{/snippet}
		<p>Are you sure you want to delete this function?</p>
	</ConformationDialog>
</div>
