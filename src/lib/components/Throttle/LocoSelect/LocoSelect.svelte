<script lang="ts">
  import { z } from "zod/v4";
  import { cn } from "$lib/utils.js";
  import { tick } from "svelte";
  import { Plus } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import type { LayoutUUID } from "$lib/client/LayoutClient.svelte";
  import type { TrainUuid } from "$lib/types/Trains/Train";
  import Check from "lucide-svelte/icons/check";
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import TrainAdd from "$lib/components/Settings/Trains/TrainAddDialog.svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";

  interface Props {
    selTrainId: TrainUuid | undefined;
    disabled?: boolean;
    layoutId: LayoutUUID;
  }

  let {
    selTrainId = $bindable(),
    disabled = false,
    layoutId,
  }: Props = $props();

  // Refresh the list of trains when the combobox is opened
  async function loadTrains() {
    const response = await fetch(`/api/layout/${layoutId}/trains/loco-select`);
    const json = await response.json();

    // Need train:
    // - Name
    // - Address
    // - Uuid
    // - Connection Name
    const Train = z.object({
      id: z.uuidv4(),
      name: z.string(),
      address: z.string(),
      connName: z.string().nullable(),
    });

    return z.array(Train).parse(json.trains);
  }

  let selTrainName: string | undefined = $state();
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
  <Popover.Trigger
    bind:ref={triggerRef}
    {disabled}
    onclick={async () => loadTrains()}
  >
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="w-full justify-between"
        {...props}
        role="combobox"
        aria-expanded={open}
        {disabled}
      >
        {selTrainName || "Select a train..."}
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
          {#await loadTrains() then trains}
            {#each trains as train}
              <Command.Item
                {disabled}
                value={train.id}
                keywords={[train.name, train.address, train.connName ?? ""]}
                onSelect={async () => {
                  selTrainId = train.id as TrainUuid;
                  selTrainName = train.name;
                  closeAndFocusTrigger();
                }}
                class=" h-10 flex justify-between {train.id == selTrainId
                  ? 'cursor-default'
                  : 'cursor-pointer'}"
              >
                <div class="flex items-center gap-2">
                  <p class="text-md">{train.name}</p>
                  <div
                    class="flex flex-col justify-center items-start text-sm leading-3 text-gray-400"
                  >
                    <p>Address: {train.address}</p>
                    {#if train.connName}
                      <p>
                        Connection: {train.connName}
                      </p>
                    {/if}
                  </div>
                </div>
                <Check
                  class={cn(
                    "mr-2 size-4",
                    selTrainId !== train.id && "text-transparent",
                  )}
                />
              </Command.Item>
            {/each}
          {/await}

          <Command.Separator class="my-1 h-[0.5px]" />

          <Command.Item
            {disabled}
            value="create-train"
            class="h-10 w-full flex-col justify-center"
          >
            <TrainAdd
              {layoutId}
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
