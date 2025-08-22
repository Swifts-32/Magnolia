<script lang="ts">
	import type { TrainFunction } from "$lib/server/db/schema/trains";
	import {
		createDefaultTrainFunction,
		deleteTrainFunction,
		getTrainFunctions,
	} from "../../../../../routes/(app)/layouts/[id]/settings/trains/trainFunctions.remote";
	import FunctionEditor from "./FunctionEditor.svelte";
	import FunctionSelector from "./FunctionSelector.svelte";

	interface Props {
		trainId: string;
	}

	let { trainId }: Props = $props();

	let selFunction: TrainFunction | undefined = $state();

	async function addFunction() {
		await createDefaultTrainFunction(trainId);
		// let newFunction = new TrainClientFunction("1", trainId);
		// // Select a function value (numerical) that is not already in use
		// let i = 0;
		// while (functions.has(`${i}`)) {
		// 	i++;
		// }
		// newFunction.value = `${i}`;
		// newFunction.name = `${newFunction.name} ${i}`;
		// functions.set(newFunction.value, newFunction);
		// selectedFunction = newFunction;
	}

	function deleteFunction() {
		if (selFunction) {
			deleteTrainFunction({
				value: selFunction.value,
				trainId: selFunction.trainUuid,
			});
			selFunction = undefined;
		}
	}
</script>

{#await getTrainFunctions(trainId) then functions}
	<FunctionSelector {functions} bind:selFunction {addFunction} />
{/await}

<!-- Function Editor -->
{#if selFunction}
	<FunctionEditor {selFunction} {deleteFunction} />
{/if}
