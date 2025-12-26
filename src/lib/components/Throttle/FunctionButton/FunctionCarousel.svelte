<script lang="ts">
	import type { CarouselAPI } from "$lib/components/ui/carousel/context";
	import * as Carousel from "$lib/components/ui/carousel/index";
	import FunctionButton from "./FunctionButton.svelte";
	import { getTrainFunctions } from "../../../client/Trains/Functions/trainFunctions.remote";
	import type { TrainFunction } from "$lib/server/db/schema/trains";
	import EmptyFunctionCarousel from "./EmptyFunctionCarousel.svelte";

	interface Props {
		disabled?: boolean;
		trainId: string;
	}

	let { disabled, trainId }: Props = $props();

	let api = $state<CarouselAPI>();
	let current = $state(0);
	const count = $derived(api ? api.scrollSnapList().length : 0);

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on("select", () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});

	// Update the chunked functions array when the functions map changes
	const chunkedFunctions2: Promise<TrainFunction[][]> = $derived.by(
		async () => {
			if (!trainId) return [];

			const functions: TrainFunction[] = await getTrainFunctions(trainId);

			// Filter out invisible functions
			let functionArray: TrainFunction[] = Array.from(
				functions.values(),
			).filter((func) => func.visible);

			// Create a chunked array (groups of 8)
			let chunkedFunctions: TrainFunction[][] = [];
			for (let i = 0; i < functionArray.length; i += 8) {
				chunkedFunctions.push(functionArray.slice(i, i + 8));
			}

			return chunkedFunctions;
		},
	);
</script>

{#await chunkedFunctions2}
	<EmptyFunctionCarousel />
{:then chunkedFunctions}
	<Carousel.Root
		class="h-full w-30 flex flex-col justify-between"
		opts={{
			loop: true,
			align: "start",
			active: chunkedFunctions.length > 1,
		}}
		setApi={(emblaApi) => (api = emblaApi)}
	>
		<Carousel.Content class="borderflex w-fit">
			{#each chunkedFunctions as chunk}
				<Carousel.Item class="w-auto!	shrink-0">
					<div class="grid grid-cols-2 auto-rows-min gap-2 w-fit">
						{#each chunk as trainFunction}
							<FunctionButton
								{trainId}
								functValue={trainFunction.functValue}
								{disabled}
							/>
						{/each}
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>

		<!-- Dots -->
		{#if chunkedFunctions.length > 1}
			<div class="flex justify-center m-1 h-5 w-full items-center">
				{#each Array(count) as _, dot}
					<button
						{disabled}
						class="rounded-full m-1 border-primary disabled:border-primary-disabled {dot +
							1 ==
						current
							? 'border-0 size-4 bg-secondary disabled:bg-secondary-disabled cursor-default'
							: 'border-2 size-3 bg-transparent cursor-pointer disabled:cursor-default'}"
						onclick={() => api?.scrollTo(dot)}
						aria-label="Function page {dot}"
					></button>
				{/each}
			</div>
		{/if}
	</Carousel.Root>
	<!-- {:else if chunkedFunctions.length == 1 && chunkedFunctions[0].length > 0}
		<div class="w-32 max-w-fit h-full">
			{#each chunkedFunctions as chunk, chunkIndex}
				<div class="grid grid-cols-2 auto-rows-min gap-2 p-0 w-full h-full">
					{#each chunk, index}
						<FunctionButton
							{disabled}
							bind:trainFunction={
								() => chunkedFunctions[chunkIndex]?.[index],
								(funct) => (chunkedFunctions[chunkIndex][index] = funct)
							}
						/>
					{/each}
				</div>
			{/each}
		</div>
	{:else}
		<button
			class="w-32 text-lg flex flex-col justify-center items-center"
			onclick={() => {
				goto(`/layouts/${page.params.id}/settings/trains`);
			}}
		>
			<Plus size={32} />
			<p>Add a Function</p>
		</button>
	{/if} -->
{/await}
