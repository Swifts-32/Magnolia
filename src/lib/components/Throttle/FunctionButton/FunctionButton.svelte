<script lang="ts">
  import FunctionIcons from "#lib/components/Trains/Functions/FunctionIcons.svelte";
  import Button from "#lib/components/ui/button/button.svelte";
  import Toggle from "#lib/components/ui/toggle/toggle.svelte";
  import {
    getTrainFunction,
    selectTrainFunction,
    toggleTrainFunction,
  } from "../../../client/TrainFunctions.remote";

  interface Props {
    disabled?: boolean;
    functId: string;
    [key: string]: any;
  }

  let { disabled, functId, ...props }: Props = $props();
</script>

{#await getTrainFunction(functId) then funct}
  {#if funct.mode == "Toggle"}
    <Toggle
      {disabled}
      size="sm"
      bind:pressed={
        () => funct.state,
        (v) => {
          toggleTrainFunction({
            id: functId,
            state: v,
          });
        }
      }
      class="size-14 p-2 flex flex-col gap-1 cursor-pointer"
      {...props}
    >
      <FunctionIcons
        size={18}
        selectedIcon={funct.icon}
        orientation="vertical"
      />
    </Toggle>
  {:else if funct.mode == "Select"}
    <Button
      {disabled}
      size="icon"
      class="size-14 p-2 flex flex-col gap-1 bg-primary active:bg-secondary active:text-secondary-foreground text-primary-foreground"
      variant="default"
      onmousedown={() => {
        selectTrainFunction(functId);
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
      />
    </Button>
  {/if}
{/await}
