<script lang="ts">
  import { Label } from "$lib/components/ui/label";
  import { Input } from "$lib/components/ui/input";
  import { tick } from "svelte";
  import {
    getSerialPorts,
    type SerialPortInfo,
  } from "./SerialConnections.remote";
  import type { RemoteFormField } from "@sveltejs/kit";

  interface Props {
    path: RemoteFormField<string>;
    baudRate: RemoteFormField<number>;
  }

  let { baudRate, path }: Props = $props();

  let serialPorts = $state(await getSerialPorts());
  let serialPathSearch: string = $state("");

  let serialPathOpen = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);
  const selectedSerialPath = $derived(
    serialPorts.find((port) => port.path === path.value()),
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
  {#each serialPorts as port}
    <p>{port.path}</p>
  {/each}
  <Input id="serialPath" {...path.as("text")} class="col-span-3" />

  <!-- <Popover.Root bind:open={serialPathOpen}>
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
                  path.set(serialPathSearch);
                  closeAndFocusSerialPathTrigger();
                }}
                class="w-80 h-10 flex justify-between {path.value() ==
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
                    path.value() !== serialPathSearch && "text-transparent",
                  )}
                />
              </Command.Item>
            {/if}

            {#each serialPorts as port (port.path)}
              {#if port.path.includes(serialPathSearch)}
                <Command.Item
                  value={port.path}
                  onSelect={() => {
                    if (path.value() == port.path) {
                      // If selecting the same port again (deselecting)
                      if (port.isCustom) {
                        serialPorts = serialPorts.filter(
                          (p) => p.path !== port.path,
                        );
                        path.set("");
                      }
                    } else {
                      // Selecting a different port
                      path.set(port.path);
                    }
                    closeAndFocusSerialPathTrigger();
                  }}
                  class="h-10 flex justify-between {path.value() == port.path
                    ? 'cursor-default'
                    : 'cursor-pointer'}"
                >
                  {@render pathItem(port)}
                  <Check
                    class={cn(
                      "mr-2 size-4",
                      path.value() !== port.path && "text-transparent",
                    )}
                  />
                </Command.Item>
              {/if}
            {/each}
          </Command.Group>
        </Command.List>
      </Command.Root>
    </Popover.Content>
  </Popover.Root> -->
</div>
<!-- Serial Baud Rate -->
<div class="grid grid-cols-4 items-center gap-4">
  <Label for="serialBaudRate" class="text-right">Baud Rate</Label>
  <Input id="serialBaudRate" {...baudRate.as("number")} class="col-span-3" />
</div>
