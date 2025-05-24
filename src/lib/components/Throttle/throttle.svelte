<script lang="ts">
  import { Card } from "$lib/components/ui/card";
  import { Slider } from "$lib/components/ui/slider";
  import { CircleAlert } from "lucide-svelte";
  import { ClientTrain } from "$lib/client/Trains/Train.svelte";
  import type { LayoutUUID } from "$lib/client/LayoutClient.svelte";
  import DirectionSelector from "$lib/components/Throttle/DirectionSelector/DirectionSelector.svelte";
  import FunctionCarousel from "./FunctionButton/FunctionCarousel.svelte";
  import LocoSelect from "$lib/components/Throttle/LocoSelect/LocoSelect.svelte";
  import Button from "../ui/button/button.svelte";

  interface Props {
    layoutId: LayoutUUID;
    disabled?: boolean;
  }

  let { layoutId, disabled: disabledProp = false }: Props = $props();

  let curTrain: ClientTrain | undefined = $state();

  // Disable throttle if:
  // - Disabled prop is true
  // - No train is selected
  const disabled: boolean = $derived(disabledProp || curTrain == undefined);
</script>

<Card class="p-5 max-w-fit h-[375px] flex flex-col select-none gap-4">
  <!-- Loco Select -->
  <LocoSelect bind:curTrain {layoutId} disabled={disabledProp} />

  <div class="flex gap-4 justify-between items-center flex-1 grow">
    <!-- Speed Slider -->
    <!-- Using onValueCommit to prevent spamming the server with speed updates -->
    <div class="w-16 h-full pb-8 pt-4">
      <Slider
        type="single"
        value={curTrain != undefined ? curTrain.speed : 9}
        max={128}
        orientation="vertical"
        step={1}
        {disabled}
        onValueCommit={(value) =>
          curTrain != undefined && (curTrain.speed = value)}
      />

      <h1 class="text-xl text-center mt-2">
        {Math.round(curTrain != undefined ? (curTrain.speed / 128) * 100 : 0)}%
      </h1>
    </div>

    <div class="flex flex-col gap-2 h-full">
      <!-- Emergency Stop -->
      <Button
        {disabled}
        class="size-[54px] m-0"
        onclick={() => curTrain?.emergencyStop()}
        variant="destructive"
        size="icon"
      >
        <CircleAlert />
      </Button>

      <!-- Direction Selector -->
      <DirectionSelector
        bind:direction={
          () =>
            curTrain != undefined ? curTrain.direction : "Unknown",
          (direction) =>
            curTrain != undefined && (curTrain.direction = direction)
        }
        {disabled}
      />
    </div>

    <FunctionCarousel functions={curTrain?.functions ?? new Map()} {disabled} />
  </div>
</Card>
