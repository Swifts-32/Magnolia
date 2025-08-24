<script lang="ts">
	import type { TrainClientFunction } from "$lib/client/Trains/Functions/Function.svelte";
	import type { CarouselAPI } from "$lib/components/ui/carousel/context";
	import * as Carousel from "$lib/components/ui/carousel/index";
	import { Plus } from "lucide-svelte";
	import FunctionButton from "./FunctionButton.svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { getTrainFunctions } from "../../../../routes/(app)/layouts/[id]/settings/trains/trainFunctions.remote";
	import type { TrainFunction } from "$lib/server/db/schema/trains";
	import Button from "$lib/components/ui/button/button.svelte";
	import FunctionIcons from "$lib/components/Settings/Trains/Functions/FunctionIcons.svelte";

	interface Props {
		disabled?: boolean;
		trainId: string | undefined;
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

<!-- {#await chunkedFunctions2 then chunkedFunctions} -->
<!-- {#if chunkedFunctions.length > 1} -->
{#if trainId}
	<Carousel.Root
		class="w-fit h-full"
		opts={{
			loop: true,
			align: "start",
			
		}}
		setApi={(embleApi) => (api = embleApi)}
	>
		<Carousel.Content>
			{#each await chunkedFunctions2 as chunk}
				<Carousel.Item>
					<div class="grid grid-cols-2 auto-rows-min gap-2 p-0 w-full h-full">
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
		<div class="flex justify-center m-1 h-5 items-center">
			{#each Array(count) as _, dot}
				<button
					{disabled}
					class="rounded-full m-1 border-primary disabled:border-primary-disabled {dot +
						1 ==
					current
						? 'border-0 size-4 bg-secondary disabled:bg-secondary-disabled cursor-default'
						: 'border-2 size-3 bg-transparent cursor-pointer disabled:cursor-default'}"
					onclick={() => api?.scrollTo(dot)}
					aria-label="Dot"
				></button>
			{/each}
		</div>
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
	{/if}
{/await} -->
{:else}
	<div class="grid grid-cols-2 auto-rows-min gap-2 p-0 w-full h-full">
		{#each Array(8) as _, index}
			<Button
				disabled={true}
				size="icon"
				class="size-14 p-2 flex flex-col gap-1 bg-primary active:bg-secondary active:text-secondary-foreground text-primary-foreground"
				variant="default"
			>
				<FunctionIcons size={18} selectedIcon={"Text"} text={false} orientation="vertical"/>
				<p>F{index}</p>
			</Button>
		{/each}
	</div>
{/if}
