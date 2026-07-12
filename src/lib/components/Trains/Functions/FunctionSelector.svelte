<script lang="ts">
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Check } from "lucide-svelte";
  import FunctionIcons from "./FunctionIcons.svelte";
  import type { TrainFunction } from "$lib/server/db/schema/trains";
  import { getTrainFunctions } from "$lib/client/TrainFunctions.remote";

  interface Props {
    trainId: string;
    selFunction: TrainFunction | undefined;
  }

  let { trainId, selFunction = $bindable() }: Props = $props();

  let isSelOpen = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);
</script>

<Popover.Root bind:open={isSelOpen}>
  <Popover.Trigger bind:ref={triggerRef} class="w-full flex justify-between">
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="w-full"
        {...props}
        role="combobox"
        aria-expanded={isSelOpen}
      >
        {#if selFunction}
          <div class="flex gap-2 align-middle">
            <FunctionIcons
              selectedIcon={selFunction.icon}
              size={18}
              text={false}
            />
            {selFunction.name}
          </div>
        {:else}
          Select a function
        {/if}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>

  <!-- TODO Make Dynamic width -->
  <Popover.Content class="p-0 w-72">
    <Command.Root>
      <Command.Input placeholder="Type to search a function" />
      <Command.Empty>No functions found.</Command.Empty>
      <Command.List>
        <Command.Group>
          {#each Array.from((await getTrainFunctions(trainId)).values()).sort( (a, b) => a.value.localeCompare(b.value), ) as funct}
            <Command.Item
              class="{selFunction?.value === funct.value
                ? 'cursor-default'
                : 'cursor-pointer'}
								 py-1 px-2"
              value={funct.value}
              keywords={[funct.name]}
              onclick={() => {
                if (selFunction?.value !== funct.value) {
                  // If not already selected, select it
                  selFunction = funct;
                  isSelOpen = false;
                }
              }}
            >
              {#if selFunction?.value === funct.value}
                <Check size={10} />
              {:else}
                <div class="w-4"></div>
              {/if}
              <FunctionIcons selectedIcon={funct.icon} text={false} size={18} />
              <div class="flex flex-col items-start">
                <p class="text-md">
                  {funct.name}
                </p>
                <p class="text-xs">
                  Value: {funct.value}
                </p>
              </div>
            </Command.Item>
          {/each}
          <!-- {/if} -->
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
