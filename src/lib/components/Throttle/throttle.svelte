<script lang="ts">
    import { Slider } from "$lib/components/ui/slider";
    import { Card } from "$lib/components/ui/card";
    import DirectionSelector from "$lib/components/Throttle/DirectionSelector/DirectionSelector.svelte";
    import LocoSelect from "$lib/components/Throttle/LocoSelect/LocoSelect.svelte";
    import FunctionCarousel from "./FunctionButton/FunctionCarousel.svelte";
    import type { Train } from "../../../services/train.svelte";
    import type {
        Connections,
        ConnectionUUID,
        LayoutClient,
    } from "$lib/LayoutClient.svelte";
    import ConnectionSelect from "./ConnectionSelect/connectionSelect.svelte";

    interface Props {
        curLayout: LayoutClient;
        disabled?: boolean;
    }
    let { curLayout, disabled }: Props = $props();

    let curConnectionUUID: ConnectionUUID | null = $state(null);
    let curConnection: Connections | undefined = $derived.by(() => {
        if (curConnectionUUID) {
            return curLayout.connections.get(curConnectionUUID);
        }
    });
    let curAddr: number | undefined = $state(undefined);
    let curTrain: Train | undefined = $derived(
        curConnection?.getTrain(curAddr),
    );

    // function updateFunc(func: number, state: boolean) {
    //     if (curAddr) {
    //         trainHandler.writeFunction(curAddr, func, state);
    //     }
    // }
</script>

<Card class="p-5 max-w-fit h-[450px] flex flex-col select-none gap-4">
    <ConnectionSelect bind:curConnectionUUID {curLayout} />
    <!-- Loco Select -->
    <LocoSelect
        bind:curAddr
        {curConnection}
        disabled={disabled || curConnection == undefined}
    />

    <div class="flex gap-4 justify-between items-center flex-1 grow">
        <div class="w-16 h-full pb-8 pt-4">
            {#if curTrain}
                <Slider
                    type="single"
                    bind:value={curTrain.speed}
                    max={128}
                    orientation="vertical"
                    step={1}
                    disabled={disabled || curTrain == undefined}
                    onValueChange={(speed) => {
                        curConnection?.setSpeed(curAddr, speed);
                    }}
                />
            {:else}
                <Slider
                    type="single"
                    orientation="vertical"
                    value={8}
                    disabled={disabled || curTrain == undefined}
                />
            {/if}

            <h1 class="text-xl text-center mt-2">
                {Math.round(
                    curTrain != undefined ? (curTrain.speed / 128) * 100 : 0,
                )}%
            </h1>
        </div>

        <!-- Direction Selecter -->
        {#if curTrain}
            <DirectionSelector
                bind:direction={curTrain.direction}
                onchanged={(dir) => curConnection?.setDirection(curAddr, dir)}
                disabled={disabled || curTrain == undefined}
            />
        {:else}
            <DirectionSelector
                direction={1}
                disabled={disabled || curTrain == undefined}
            />
        {/if}

        {#key curAddr}
            <FunctionCarousel
                onclick={(id, state) =>
                    curConnection?.setFunction(curAddr, id, state)}
                functions={curTrain?.functions ?? null}
                disabled={disabled || curTrain == undefined}
            />
        {/key}
    </div>
</Card>
