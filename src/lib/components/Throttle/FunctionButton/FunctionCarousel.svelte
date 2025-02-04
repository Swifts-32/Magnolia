<script lang="ts">
    import type { CarouselAPI } from "$lib/components/ui/carousel/context";
    import * as Carousel from "$lib/components/ui/carousel/index";
    import type { Funct } from "../../../../services/train.svelte";
    import FunctionButton from "./FunctionButton.svelte";

    interface Props {
        disabled?: boolean;
        functions: Map<number, Funct> | null;
        onclick?: (id: number, state: boolean) => void;
    }

    let { functions, onclick, disabled }: Props = $props();

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

    // Function to chunk array into specified size
    function chunkArray<T>(array: T[], size: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    let entriesArray: Funct[] = [];
    if (functions) {
        entriesArray = Array.from(functions.values()).filter(func => func.visible);
    }

    const chunkedEntries = chunkArray(entriesArray, 8);
</script>

{#if functions}
    <Carousel.Root
        class="w-32 max-w-fit h-full"
        opts={{
            loop: true,
            align: "start",
        }}
        setApi={(embleApi) => (api = embleApi)}
    >
        <Carousel.Content>
            {#each chunkedEntries as funcs}
                <Carousel.Item>
                    <div
                        class="grid grid-cols-2 auto-rows-min gap-2 p-0 w-full h-full"
                    >
                        {#each funcs as func}
                            <FunctionButton
                                {disabled}
                                icon={func.icon}
                                id={func.id}
                                mode={func.mode}
                                name={func.mode}
                                bind:selected={func.state}
                                {onclick}
                            />
                        {/each}
                    </div>
                </Carousel.Item>
            {/each}
        </Carousel.Content>

        <!-- Dots -->
        {#if chunkedEntries.length > 1}
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
        {/if}
    </Carousel.Root>
{/if}
