<script lang="ts">
    import FunctionIcons from "$lib/components/Trains/Functions/FunctionIcons.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import Toggle from "$lib/components/ui/toggle/toggle.svelte";
	import {
		getTrainFunction,
		selectTrainFunction,
		toggleTrainFunction,
	} from "../../../client/TrainFunctions.remote";

	interface Props {
		disabled?: boolean;
		trainId: string;
		functValue: string;
		[key: string]: any;
	}

	let { trainId, functValue, disabled, ...props }: Props = $props();
</script>

{#await getTrainFunction({ trainId, value: functValue }) then trainFunction}
	{#if trainFunction.mode == "Toggle"}
		<Toggle
			{disabled}
			size="sm"
			bind:pressed={
				() => trainFunction.state,
				(v) => {
					toggleTrainFunction({
						trainId: trainFunction.trainId,
						value: trainFunction.value,
						state: v,
					});
				}
			}
			class="size-14 p-2 flex flex-col gap-1 cursor-pointer"
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
				selectTrainFunction({
					trainId: trainFunction.trainId,
					value: trainFunction.value,
				});
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
{/await}
