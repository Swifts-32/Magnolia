<script lang="ts">
  import { Slider } from "$lib/components/ui/slider";
  import { Card } from "$lib/components/ui/card";
  import DirectionSelector from "$lib/components/Throttle/DirectionSelector/DirectionSelector.svelte";
  import LocoSelect from "$lib/components/Throttle/LocoSelect/LocoSelect.svelte";
  import FunctionCarousel from "./FunctionButton/FunctionCarousel.svelte";
  import type { LayoutClient } from "$lib/client/LayoutClient.svelte";
  import { ClientTrain } from "$lib/client/Trains/Train.svelte";
  import Button from "../ui/button/button.svelte";
  import type { ClientConnection } from "$lib/client/Connections/ClientConnection.svelte";
  import { CircleAlert } from "lucide-svelte";
  import {
    TrainFunctionIcons,
    type TrainFunctionData,
  } from "$lib/types/Trains/Functions/Functions";
  import { toast } from "svelte-sonner";

  interface Props {
    layout: LayoutClient;
    disabled?: boolean;
  }
  let { layout, disabled: disabledProp = false }: Props = $props();

  let curConnection: ClientConnection | undefined = $derived.by(() => {
    if (curTrain) {
      return layout.connections.get(curTrain.connUUID);
    }
    return undefined;
  });
  let curTrain: ClientTrain | undefined = $state();

  // Disable throttle if:
  // - Disabled prop is true
  // - No train is selected
  // - Train is not connected to a connection
  let disabled: boolean = $derived(
    disabledProp || curTrain == undefined || !curConnection?.isConnected,
  );

  function handleDirectionChange(newDirection: number) {
    if (!curTrain || !curConnection) return;
    curConnection.setTrainDirection(curTrain.uuid, newDirection);
  }
  function handleSpeedChange(newSpeed: number) {
    if (!curTrain || !curConnection) return;
    curConnection.setTrainSpeed(curTrain.uuid, newSpeed);
  }
</script>

<Card class="p-5 max-w-fit h-[450px] flex flex-col select-none gap-4">
  <div>
    <h1 class="text-2xl">Throttle</h1>
    <p class="text-[0.7rem]">Control the speed and direction of your train</p>
    <Button
      class="size-[54px] m-0"
      onclick={() => {
        if (curTrain == undefined) return;

        const data: TrainFunctionData = {
          uuid: crypto.randomUUID(),
          value: "1",
          name: "Function 1",
          icon: TrainFunctionIcons.Light1,
          mode: "toggle",
          visible: true,
        };

        fetch(
          `/api/layout/${layout.uuid}/trains/${curTrain?.uuid}/functions/add`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          },
        )
          .then(async (res) => {
            let json = await res.json();
            if (res.ok) {
              toast.success(json.message);
            } else {
              toast.error(json.message);
            }
          })
          .catch((err) => {
            toast.error(err);
          });
      }}
      variant="destructive"
      size="icon"
    />
  </div>

  <!-- Loco Select -->
  <LocoSelect bind:curTrain {layout} disabled={disabledProp} />

  <div class="flex gap-4 justify-between items-center flex-1 grow">
    <!-- Speed Slider -->
    <div class="w-16 h-full pb-8 pt-4">
      {#if curTrain}
        <Slider
          type="single"
          bind:value={curTrain.speed}
          max={128}
          orientation="vertical"
          step={1}
          {disabled}
          onValueChange={handleSpeedChange}
        />
      {:else}
        <Slider
          type="single"
          orientation="vertical"
          value={8}
          disabled={true}
        />
      {/if}

      <h1 class="text-xl text-center mt-2">
        {Math.round(curTrain != undefined ? (curTrain.speed / 128) * 100 : 0)}%
      </h1>
    </div>

    <div class="flex flex-col gap-2 h-full">
      <!-- Emergency Stop -->
      <Button
        {disabled}
        class="size-[54px] m-0"
        onclick={() => curConnection?.emergencyStop()}
        variant="destructive"
        size="icon"
      >
        <CircleAlert />
      </Button>

      <!-- Direction Selector -->
      {#if curTrain}
        <DirectionSelector
          bind:direction={curTrain.direction}
          onchanged={handleDirectionChange}
          {disabled}
        />
      {:else}
        <DirectionSelector direction={1} disabled={true} />
      {/if}
    </div>

    {#key curTrain}
      <FunctionCarousel
        onclick={(id, state) => {
          console.log("Function clicked", id);
        }}
        functions={curTrain?.functions ?? null}
        disabled={disabled || curTrain == undefined}
      />
    {/key}
  </div>
</Card>
