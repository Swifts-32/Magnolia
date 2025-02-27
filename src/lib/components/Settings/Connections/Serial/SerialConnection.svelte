<script lang="ts">
  import Check from "lucide-svelte/icons/check";
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import { onMount, tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { cn } from "$lib/utils.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

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
    isCustom?: boolean; // Track custom ports
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
  let serialPathSearch: string = $state("");

  onMount(async () => {
    serialPorts = await getSerialPorts();
  });

  let serialPathOpen = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);
  const selectedSerialPath = $derived(
    serialPorts.find((port) => port.path === serialPath)
  );

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
      class="flex flex-col justify-center items-start leading-3 text-xs text-gray-400"
    >
      {#if port.isCustom}
        <p>Custom Port</p>
      {:else}
        <p>{port.friendlyName ?? "Undefined Name"}</p>
        <p>{port.manufacturer ?? "Undefined Manufacturer"}</p>
      {/if}
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
      <Command.Root class="w-full" shouldFilter={false}>
        <Command.Input
          placeholder="Type to add a custom port"
          bind:value={serialPathSearch}
        />
        <Command.List>
          <Command.Group>
            {#if serialPathSearch?.trim() && !serialPorts.some((port) => port.path === serialPathSearch)}
              <Command.Item
                value="CustomFilter"
                onSelect={() => {
                  serialPorts = [
                    ...serialPorts,
                    {
                      path: serialPathSearch,
                      friendlyName: "Custom Port",
                      isCustom: true,
                    },
                  ];
                  serialPath = serialPathSearch;
                  closeAndFocusSerialPathTrigger();
                }}
                class="w-80 h-10 flex justify-between {serialPath ==
                serialPathSearch
                  ? 'cursor-default'
                  : 'cursor-pointer'}"
              >
                {@render pathItem({
                  path: serialPathSearch,
                  friendlyName: "Custom Port",
                  isCustom: true,
                })}
                <Check
                  class={cn(
                    "mr-2 size-4",
                    serialPath !== serialPathSearch && "text-transparent"
                  )}
                />
              </Command.Item>
            {/if}

            {#each serialPorts as port (port.path)}
              {#if port.path.includes(serialPathSearch)}
                <Command.Item
                  value={port.path}
                  onSelect={() => {
                    if (serialPath == port.path) {
                      // If selecting the same port again (deselecting)
                      if (port.isCustom) {
                        serialPorts = serialPorts.filter(
                          (p) => p.path !== port.path
                        );
                        serialPath = undefined;
                      }
                    } else {
                      // Selecting a different port
                      serialPath = port.path;
                    }
                    closeAndFocusSerialPathTrigger();
                  }}
                  class="h-10 flex justify-between {serialPath == port.path
                    ? 'cursor-default'
                    : 'cursor-pointer'}"
                >
                  {@render pathItem(port)}
                  <Check
                    class={cn(
                      "mr-2 size-4",
                      serialPath !== port.path && "text-transparent"
                    )}
                  />
                </Command.Item>
              {/if}
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
