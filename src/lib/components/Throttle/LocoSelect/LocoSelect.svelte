<script lang="ts">
  import { cn } from "#lib/utils.js";
  import { tick } from "svelte";
  import { Check, ChevronsUpDown, Plus } from "@lucide/svelte";
  import { Button } from "#lib/components/ui/button/index.js";
  import * as Command from "#lib/components/ui/command/index.js";
  import * as Popover from "#lib/components/ui/popover/index.js";
  import { getLayoutTrains } from "#lib/client/Trains.remote.js";
  import { getConnection } from "#lib/client/Connections.remote.js";
  import AddTrainDialog from "#lib/components/Trains/AddTrainDialog.svelte";

  interface Props {
    selTrainId: string | undefined;
    disabled?: boolean;
    layoutId: string;
  }

  let {
    selTrainId = $bindable(),
    disabled = false,
    layoutId,
  }: Props = $props();

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
  <Popover.Trigger bind:ref={triggerRef} {disabled}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="w-60 justify-between"
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
          {#each await getLayoutTrains(layoutId) as train}
            <Command.Item
              disabled={disabled || train.userControllingId !== null}
              value={train.uuid}
              keywords={[train.name, train.address]}
              onSelect={async () => {
                if (train.userControllingId === null) {
                  selTrainId = train.uuid;
                  selTrainName = train.name;
                  closeAndFocusTrigger();
                }
              }}
              class="h-10 flex justify-between {train.uuid == selTrainId ||
              train.userControllingId
                ? 'cursor-default'
                : 'cursor-pointer'}"
            >
              <div class="flex items-center gap-2">
                <p class="text-md">{train.name}</p>
                <div
                  class="flex flex-col justify-center items-start text-sm leading-3 text-gray-400"
                >
                  <p>Address: {train.address}</p>
                  {#await getConnection(train.connectionUuid) then connection}
                    <p class="text-sm text-gray-400">
                      Connection: {connection.name}
                    </p>
                  {:catch}
                    <p class="text-sm text-red-400">No Connection</p>
                  {/await}
                </div>
              </div>
              <Check
                class={cn(
                  "mr-2 size-4",
                  selTrainId !== train.uuid && "text-transparent",
                )}
              />
            </Command.Item>
          {/each}

          <Command.Separator class="my-1 h-[0.5px]" />

          <AddTrainDialog {layoutId}>
            <Command.Item
              {disabled}
              value="create-train"
              class="h-10 w-full flex gap-2 items-center justify-center"
            >
              <Plus class="size-6" />
              <p>Create Train</p>
            </Command.Item>
          </AddTrainDialog>
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
