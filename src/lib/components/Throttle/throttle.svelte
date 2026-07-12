<script lang="ts">
  import { Card } from "$lib/components/ui/card";
  import { Slider } from "$lib/components/ui/slider";
  import { CircleAlert, Trash } from "lucide-svelte";
  import DirectionSelector from "$lib/components/Throttle/DirectionSelector/DirectionSelector.svelte";
  import FunctionCarousel from "./FunctionButton/FunctionCarousel.svelte";
  import LocoSelect from "$lib/components/Throttle/LocoSelect/LocoSelect.svelte";
  import Button from "../ui/button/button.svelte";
  import type { TrainUuid } from "$lib/types/Trains";
  import EmptyFunctionCarousel from "./FunctionButton/EmptyFunctionCarousel.svelte";
    import { getTrain, setTrainMotion, trainEmergencyStop } from "$lib/client/Trains.remote";

  interface Props {
    layoutId: string;
    throttleId: string;
    disabled?: boolean;
    deleteThrottle?: (id: string) => void;
  }

  let {
    layoutId,
    throttleId,
    deleteThrottle,
    disabled: disabledProp = false,
  }: Props = $props();

  let selTrainId: TrainUuid | undefined = $state();
  const curTrain = $derived(selTrainId && (await getTrain(selTrainId)));

  // Disable throttle if:
  // - Disabled prop is true
  // - No train is selected
  const disabled: boolean = $derived(disabledProp || selTrainId == undefined);
  let throttleValue = $derived(curTrain?.speed ?? 0);
  let lastSent = 0;
  const throttleDelay = 100;

  // Throttle Slider
  function handleThrottleChanged(value: number) {
    if (!curTrain) return;

    throttleValue = value;
    const now = Date.now();

    if (now - lastSent > throttleDelay) {
      setTrainMotion({
        direction: curTrain.direction,
        speed: value,
        trainId: curTrain.uuid,
      });

      lastSent = now;
    }
  }
</script>

<Card class="p-5 min-w-[300px] w-fit h-[375px] flex flex-col select-none gap-4">
  <!-- Loco Select and Delete Throttle Button -->
  <div class="flex gap-2 w-full">
    <!-- Loco Select -->
    <LocoSelect bind:selTrainId {layoutId} disabled={disabledProp} />

    <Button
      size="icon"
      variant="destructive"
      onclick={() => deleteThrottle?.(throttleId)}
    >
      <Trash />
    </Button>
  </div>

  <div class="flex gap-4 justify-between items-center h-full w-full">
    <!-- Speed Slider -->
    <div class="w-16 h-full pb-8 pt-4">
      <Slider
        type="single"
        value={throttleValue}
        max={128}
        orientation="vertical"
        step={1}
        {disabled}
        onValueChange={handleThrottleChanged}
      />

      <h1 class="text-xl text-center mt-2">
        {Math.round(curTrain != undefined ? (curTrain.speed / 128) * 100 : 0)}%
      </h1>
    </div>

    <!-- Emergency Stop and Direction Slider -->
    <div class="flex flex-col gap-2 h-full">
      <!-- Emergency Stop -->
      <Button
        {disabled}
        class="size-[54px] m-0 p-0"
        variant="destructive"
        size="icon-lg"
        onclick={() => curTrain && trainEmergencyStop(curTrain.uuid)}
      >
        <CircleAlert size={100} />
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

    <!-- Function Carousel -->
    {#if selTrainId}
      <FunctionCarousel trainId={selTrainId} {disabled} />
    {:else}
      <EmptyFunctionCarousel />
    {/if}
  </div>
</Card>
