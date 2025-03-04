<script lang="ts">
	import { TrainClientFunction } from "$lib/client/Trains/Functions/Function.svelte";
	import FunctionEditor from "./FunctionEditor.svelte";
	import FunctionSelector from "./FunctionSelector.svelte";

	interface Props {
		functions: Map<string, TrainClientFunction>;
	}

	let { functions = $bindable() }: Props = $props();

	let selectedFunction: TrainClientFunction | undefined = $state();

	function addFunction() {
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
