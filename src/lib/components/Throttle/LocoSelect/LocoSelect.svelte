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
  import { Plus } from "lucide-svelte";
  import TrainAdd from "$lib/components/Settings/Trains/TrainAddDialog.svelte";

  interface Props {
    curTrain: ClientTrain | undefined;
    disabled?: boolean;
    layout: LayoutClient;
  }

  let { curTrain = $bindable(), disabled = false, layout }: Props = $props();

  let open = $state(false);
  let trainSearch: string = $state("");
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
    <Command.Root
      filter={(value, search, keywords) => {
        if (value === "create-train") return 1;
        return keywords?.some((k) =>
          k.toLowerCase().includes(search.trim().toLowerCase()),
        )
          ? 1
          : 0;
      }}
    >
      <Command.Input
        placeholder="Search trains..."
        bind:value={trainSearch}
        {disabled}
      />
      <Command.List>
        <Command.Empty>No trains found.</Command.Empty>
        <Command.Group>
          {#each layout.trains.values() as train}
            <Command.Item
              {disabled}
              value={train.uuid}
              keywords={[
                train.name,
                train.address.toString(),
                layout.connections.get(train.connUUID)?.name ?? "Undefined",
              ]}
              onSelect={() => {
                curTrain = train;
                closeAndFocusTrigger();
              }}
              class=" h-10 flex justify-between {train.uuid == curTrain?.uuid
                ? 'cursor-default'
                : 'cursor-pointer'}"
            >
              <div class="flex items-center gap-2">
                <p class="text-md">{train.name}</p>
                <div
                  class="flex flex-col justify-center items-start text-sm leading-3 text-gray-400"
                >
                  <p>Address: {train.address}</p>
                  <p>
                    Connection: {layout.connections.get(train.connUUID)?.name ??
                      "Undefined"}
                  </p>
                </div>
              </div>
              <Check
                class={cn(
                  "mr-2 size-4",
                  curTrain?.uuid !== train.uuid && "text-transparent",
                )}
              />
            </Command.Item>
          {/each}

          <Command.Separator class="my-1 h-[0.5px]" />

          <Command.Item
            {disabled}
            value="create-train"
            class="h-10 w-full flex-col justify-center"
          >
            <TrainAdd
              {layout}
              class="flex size-full items-center justify-center gap-2"
            >
              <Plus class="size-6" />
              <p>Create Train</p>
            </TrainAdd>
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
