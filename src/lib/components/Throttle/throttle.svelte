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
  } from "$lib/client/LayoutClient.svelte";
  import ConnectionSelect from "./ConnectionSelect/connectionSelect.svelte";
  import { ClientTrain } from "$lib/client/Trains/Train.svelte";

  interface Props {
    layout: LayoutClient;
    disabled?: boolean;
  }
  let { layout, disabled }: Props = $props();

  let curConnectionUUID: ConnectionUUID | null = $state(null);
  let curConnection: Connections | undefined = $derived.by(() => {
    if (curConnectionUUID) {
      return layout.connections.get(curConnectionUUID);
    }
  });
  let curAddr: number | undefined = $state(undefined);
  let curTrain: ClientTrain | undefined = $state();

  // function updateFunc(func: number, state: boolean) {
  //     if (curAddr) {
  //         trainHandler.writeFunction(curAddr, func, state);
  //     }
  // }
</script>

<Card class="p-5 max-w-fit h-[450px] flex flex-col select-none gap-4">
  <!-- Loco Select -->
  <LocoSelect bind:curTrain {layout} {disabled} />

  <div class="flex gap-4 justify-between items-center flex-1 grow">
    <div class="w-16 h-full pb-8 pt-4">
      {#if curTrain}
        <Slider
          type="single"
          bind:value={curTrain.speed}
          max={128}
          orientation="vertical"
          step={1}
          {disabled}
          onValueChange={(speed) => {
            if (curTrain) {
              layout.setTrainDirection(curTrain.uuid, speed);
            }
          }}
        />
      {:else}
        <Slider
          type="single"
          orientation="vertical"
          value={8}
          {disabled}
        />
      {/if}

      <h1 class="text-xl text-center mt-2">
        {Math.round(curTrain != undefined ? (curTrain.speed / 128) * 100 : 0)}%
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
        onclick={(id, state) => {}}
        functions={curTrain?.functions ?? null}
        disabled={disabled || curTrain == undefined}
      />
    {/key}
  </div>
</Card>
