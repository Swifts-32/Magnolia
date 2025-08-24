<script lang="ts">
  import { Card } from "$lib/components/ui/card";
  import { Slider } from "$lib/components/ui/slider";
  import { CircleAlert } from "lucide-svelte";
  import DirectionSelector from "$lib/components/Throttle/DirectionSelector/DirectionSelector.svelte";
  import FunctionCarousel from "./FunctionButton/FunctionCarousel.svelte";
  import LocoSelect from "$lib/components/Throttle/LocoSelect/LocoSelect.svelte";
  import Button from "../ui/button/button.svelte";
  import type { TrainUuid } from "$lib/types/Trains/Train";
  import {
    getTrain,
    setTrainMotion,
    trainEmergencyStop,
  } from "../../../routes/(app)/layouts/[id]/settings/trains/trains.remote";

  interface Props {
    layoutId: string;
    disabled?: boolean;
  }

  let { layoutId, disabled: disabledProp = false }: Props = $props();

  // const layout = getLayoutClientState();
  let selTrainId: TrainUuid | undefined = $state();

  // Disable throttle if:
  // - Disabled prop is true
  // - No train is selected
  const disabled: boolean = $derived(disabledProp || selTrainId == undefined);
</script>

<Card class="p-5 min-w-[300px] w-fit h-[375px] flex flex-col select-none gap-4">
  <!-- Loco Select -->
  <LocoSelect bind:selTrainId {layoutId} disabled={disabledProp} />

  <div class="flex gap-4 justify-between items-center h-full w-full">
    {#await selTrainId && getTrain(selTrainId) then curTrain}
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
          onValueCommit={(value) => {
            if (!curTrain) return;

            setTrainMotion({
              direction: curTrain.direction,
              speed: value,
              trainId: curTrain.uuid,
            });
          }}
        />

        <h1 class="text-xl text-center mt-2">
          {Math.round(
            curTrain != undefined ? (curTrain.speed / 128) * 100 : 0,
          )}%
        </h1>
      </div>

      <div class="flex flex-col gap-2 h-full">
        <!-- Emergency Stop -->
        <Button
          {disabled}
          class="size-[54px] m-0"
          variant="destructive"
          size="icon"
          onclick={() => curTrain && trainEmergencyStop(curTrain.uuid)}
        >
          <CircleAlert />
        </Button>

        <!-- Direction Selector -->
        <DirectionSelector
          bind:direction={
            () => (curTrain != undefined ? curTrain.direction : "Unknown"),
            (direction) => {
              if (!curTrain) return;

              setTrainMotion({
                direction,
                speed: curTrain.speed,
                trainId: curTrain.uuid,
              });
            }
          }
          {disabled}
        />
      </div>

      <FunctionCarousel trainId={curTrain?.uuid} {disabled} />
    {/await}
  </div>
</Card>
