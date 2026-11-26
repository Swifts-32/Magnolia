<script lang="ts">
  import type { CarouselAPI } from "#lib/components/ui/carousel/context.js";
  import * as Carousel from "#lib/components/ui/carousel/index.js";
  import FunctionButton from "./FunctionButton.svelte";
  import type { TrainFunction } from "#lib/server/db/schema/trains.js";
  import EmptyFunctionCarousel from "./EmptyFunctionCarousel.svelte";
  import { getTrainFunctions } from "#lib/components/Trains/TrainFunctions.remote.ts";

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
            {#each chunk as trainFunction (trainFunction.id)}
              <FunctionButton funct={trainFunction} {disabled} />
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
{/await}
