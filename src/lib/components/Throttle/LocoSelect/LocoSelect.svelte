<script lang="ts">
  import Check from "lucide-svelte/icons/check";
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";
  import type { LayoutClient } from "$lib/client/LayoutClient.svelte";
  import type { ClientTrain } from "$lib/client/Trains/Train.svelte";

  interface Props {
    curTrain: ClientTrain | undefined;
    disabled?: boolean;
    layout: LayoutClient;
  }

  let { curTrain = $bindable(), disabled = false, layout }: Props = $props();


  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);
  function closeAndFocusTrigger() {
    open = false;

    tick().then(() => {
      triggerRef.focus();
    });
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef} {disabled}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="w-full justify-between"
        {...props}
        role="combobox"
        aria-expanded={open}
        {disabled}
      >
        {curTrain?.name || "Select a train..."}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[275px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search trains..." {disabled} />
      <Command.List>
        <Command.Empty>No trains found. :(</Command.Empty>
        <Command.Group>
          {#each layout.getTrains().values() as train}
            <Command.Item
              {disabled}
              value={train.name}
              onSelect={() => {
                curTrain = train;
                closeAndFocusTrigger();
              }}
              class="flex justify-between {train.uuid == curTrain?.uuid
                ? 'cursor-default'
                : 'cursor-pointer'}"
            >
              <div class="flex flex-col">
                <p class="text-md">{train.name}</p>
                <p class="text-xs text-gray-500 leading-[0.5rem]">
                  ID: {train.address}
                </p>
                <p class="text-xs text-gray-500 leading-[0.5rem]">

                  Connection: {layout.connections.get(train.connUUID)?.name ?? "Undefined"}
                </p>
              </div>
              <Check


                class={cn(
                  "mr-2 size-4",
                  curTrain?.uuid !== train.uuid && "text-transparent"
                )}
              />
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
