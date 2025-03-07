<script lang="ts">
	import type { TrainClientFunction } from "$lib/client/Trains/Functions/Function.svelte";
	import FunctionIcons from "$lib/components/Settings/Trains/Functions/FunctionIcons.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import Toggle from "$lib/components/ui/toggle/toggle.svelte";

	interface Props {
		disabled?: boolean;
		trainFunction: TrainClientFunction;
		onclick?: (funct: TrainClientFunction) => void;
		[key: string]: any;
	}

	let {
		trainFunction = $bindable(),
		onclick,
		disabled,
		...props
	}: Props = $props();
</script>

{#if trainFunction.mode == "Toggle"}
	<Toggle
		{disabled}
		size="icon"
		pressed={trainFunction.state}
		class="size-14 p-2 flex flex-col gap-1"
		onclick={() => {
			trainFunction.state = !trainFunction.state;
			// onclick?.(trainFunction);
		}}
		{...props}
	>
		<FunctionIcons
			size={18}
			selectedIcon={trainFunction.icon}
			orientation="vertical"
		/>
	</Toggle>
{:else if trainFunction.mode == "Select"}
	<Button
		{disabled}
		size="icon"
		class="size-14 p-2 flex flex-col gap-1 bg-primary active:bg-secondary active:text-secondary-foreground text-primary-foreground"
		variant="default"
		onmousedown={() => {
			trainFunction.state = true;
			onclick?.(trainFunction);
		}}
		onmouseup={() => {
			trainFunction.state = false;
			onclick?.(trainFunction);
		}}
		{...props}
	>
		<FunctionIcons
			size={18}
			selectedIcon={trainFunction.icon}
			orientation="vertical"
		/>
	</Button>
{/if}
