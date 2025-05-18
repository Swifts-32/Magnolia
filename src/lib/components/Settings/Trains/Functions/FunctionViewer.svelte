<script lang="ts">
	import type {
		ConnectionUUID,
		LayoutUUID,
	} from "$lib/client/LayoutClient.svelte";
	import { TrainClientFunction } from "$lib/client/Trains/Functions/Function.svelte";
	import type { TrainUuid } from "$lib/types/Trains/Train";
	import FunctionEditor from "./FunctionEditor.svelte";
	import FunctionSelector from "./FunctionSelector.svelte";

	interface Props {
		functions: Map<string, TrainClientFunction>;
		trainUUID: TrainUuid;
	}

	let { functions = $bindable(), trainUUID: trainUuid }: Props = $props();

	let selectedFunction: TrainClientFunction | undefined = $state();

	function addFunction() {
		let newFunction = new TrainClientFunction("1", trainUuid);

		// Select a function value (numerical) that is not already in use
		let i = 0;
		while (functions.has(`${i}`)) {
			i++;
		}
		newFunction.value = `${i}`;
		newFunction.name = `${newFunction.name} ${i}`;

		functions.set(newFunction.value, newFunction);
		selectedFunction = newFunction;
	}
</script>

<FunctionSelector bind:functions bind:selectedFunction {addFunction} />

<!-- Function Editor -->
{#if selectedFunction}
	<FunctionEditor
		{selectedFunction}
		deleteFunction={() => {
			if (selectedFunction) {
				functions.delete(selectedFunction.value);
				selectedFunction = undefined;
			}
		}}
	/>
{/if}
