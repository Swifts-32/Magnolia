<script lang="ts">
	import type { TrainClientFunction } from "$lib/client/Trains/Functions/Function.svelte";
	import FunctionIcons from "$lib/components/Settings/Trains/Functions/FunctionIcons.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import Toggle from "$lib/components/ui/toggle/toggle.svelte";

	interface Props {
		disabled?: boolean;
		trainFunction: TrainClientFunction;
		[key: string]: any;
	}

	let {
		trainFunction = $bindable(),
		disabled,
		...props
	}: Props = $props();

</script>

{#if trainFunction.mode == "Toggle"}
	<Toggle
		{disabled}
		size="icon"
		bind:pressed={trainFunction.state}
		class="size-14 p-2 flex flex-col gap-1"
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
		}}
		onmouseup={() => {
			trainFunction.state = false;
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
