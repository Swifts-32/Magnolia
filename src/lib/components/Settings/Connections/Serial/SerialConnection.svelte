<script lang="ts">
  import { ClientConnection } from "$lib/client/Connections/ClientConnection.svelte";
  import Check from "lucide-svelte/icons/check";
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import { onMount, tick, untrack } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { cn } from "$lib/utils.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Select from "$lib/components/ui/select/index.js";

  interface Props {
    serialPath: string | undefined;
    serialBaudRate: number | undefined;
  }

  let { serialPath = $bindable(), serialBaudRate = $bindable() }: Props =
    $props();

  interface SerialPortInfo {
    path: string;
    manufacturer?: string;
    serialNumber?: string;
    pnpId?: string;
    locationId?: string;
    vendorId?: string;
    productId?: string;
    friendlyName?: string;
  }

  async function getSerialPorts(): Promise<SerialPortInfo[]> {
    const ports: SerialPortInfo[] = await fetch(
      "/api/connections/serial/list"
    ).then(async (response) => {
      const data = await response.json();
      return data.message;
    });
    return ports;
  }

  let serialPorts: SerialPortInfo[] = $state([]);
  let serialPathSearch = $state("");

  onMount(async () => {
    serialPorts = await getSerialPorts();
  });

  let serialPathOpen = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);
  const selectedSerialPath = $derived(
    serialPorts.find((port) => port.path === serialPath)
  );

  $effect.pre(() => {
    const currentPorts = untrack(() => serialPorts);
    serialPorts = [
      ...currentPorts.filter((port) => port.friendlyName !== "Custom Port"),
      ...(serialPathSearch
        ? [
            {
              path: serialPathSearch,
              friendlyName: "Custom Port",
            },
          ]
        : []),
    ];
  });

  $inspect(serialPorts);

  function closeAndFocusSerialPathTrigger() {
    serialPathOpen = false;

    tick().then(() => {
      triggerRef?.focus();
    });
  }
</script>

{#snippet pathItem(port: SerialPortInfo)}
  <div class="flex flex-1 justify-start items-center gap-2">
    <p>{port.path ?? "Undefined Path"}</p>
    <div
      class="flex flex-col justify-center items-start text-[0.6rem] leading-3 text-gray-400"
    >
      <p>{port.friendlyName ?? "Undefined Name"}</p>
      <p>{port.manufacturer ?? "Undefined Manufacturer"}</p>
    </div>
  </div>
{/snippet}

<!-- Serial Path -->
<div class="grid grid-cols-4 items-center gap-4 w-full">
  <Label for="serialPath" class="text-right">Serial Path</Label>
  <Popover.Root bind:open={serialPathOpen}>
    <Popover.Trigger bind:ref={triggerRef} class="col-span-3">
      {#snippet child({ props })}
        <Button
          variant="outline"
          class="w-full"
          {...props}
          role="combobox"
          aria-expanded={serialPathOpen}
        >
          {#if selectedSerialPath}
            {@render pathItem(selectedSerialPath)}
          {:else}
            <p class="text-left flex-1">Select a serial port...</p>
          {/if}

          <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="p-0 w-full">
      <Command.Root class="w-full">
        <Command.Input
          placeholder="Search paths..."
          bind:value={serialPathSearch}
        />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          {#if serialPathSearch}
            <Command.Item
              class="w-96"
              value={serialPathSearch}
              onSelect={() => {
                serialPath = serialPathSearch;
                closeAndFocusSerialPathTrigger();
              }}

            >
              <Check
                class={cn("mr-2 size-4", serialPath !== serialPathSearch && "text-transparent")}
              />
            <div class="flex flex-1 justify-start items-center gap-2">
              <p>{serialPathSearch}</p>
              <div
                class="flex flex-col justify-center items-start text-[0.6rem] leading-3 text-gray-400"
              >
                <p>Custom Port</p>
              </div>
            </div>
            </Command.Item>
          {/if}

          <Command.Group>
            {#each serialPorts as port (port.path)}

              <Command.Item
                value={port.path}
                onSelect={() => {
                  serialPath = port.path;
                  closeAndFocusSerialPathTrigger();
                }}
              >
                {@render pathItem(port)}
                <Check
                  class={cn(
                    "mr-2 size-4",
                    serialPath !== port.path && "text-transparent"
                  )}
                />
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.List>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
</div>
<!-- Serial Baud Rate -->
<div class="grid grid-cols-4 items-center gap-4">
  <Label for="serialBaudRate" class="text-right">Baud Rate</Label>
  <Input
    id="serialBaudRate"
    type="number"
    bind:value={serialBaudRate}
    class="col-span-3"
  />
</div>
