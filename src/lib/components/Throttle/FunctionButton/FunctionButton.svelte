<script lang="ts">
  import {
    selectTrainFunction,
    toggleTrainFunction,
  } from "#lib/components/Trains/TrainFunctions.remote.ts";
  import FunctionIcons from "#lib/components/Trains/ui/Functions/FunctionIcons.svelte";
  import Button from "#lib/components/ui/button/button.svelte";
  import Toggle from "#lib/components/ui/toggle/toggle.svelte";
  import type { TrainFunction } from "#lib/server/db/schema/trains.ts";

  interface Props {
    disabled?: boolean;
    funct: TrainFunction;
  }

  let { disabled, funct, ...props }: Props = $props();
</script>

{#if funct.mode == "Toggle"}
  <Toggle
    {disabled}
    size="sm"
    pressed={funct.state}
    onPressedChange={(v) => {
      toggleTrainFunction({
        id: funct.id,
        state: v,
      });
    }}
    class="size-14 p-2 flex flex-col gap-1 cursor-pointer"
    {...props}
  >
    <FunctionIcons
      size={18}
      selectedIcon={funct.icon}
      orientation="vertical"
      text={funct.name}
    />
  </Toggle>
{:else if funct.mode == "Select"}
  <Button
    {disabled}
    size="icon"
    class="size-14 p-2 flex flex-col gap-1 bg-primary active:bg-secondary active:text-secondary-foreground text-primary-foreground"
    variant="default"
    onmousedown={() => {
      selectTrainFunction(funct.id);
      funct.state = true;
    }}
    onmouseup={() => {
      funct.state = false;
    }}
    {...props}
  >
    <FunctionIcons
      size={18}
      selectedIcon={funct.icon}
      orientation="vertical"
      text={funct.name}
    />
  </Button>
{/if}
