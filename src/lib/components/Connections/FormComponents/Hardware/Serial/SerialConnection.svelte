<script lang="ts">
  import type { RemoteFormField } from "$app/server";
  import { Label } from "#lib/components/ui/label/index.js";
  import { Input } from "#lib/components/ui/input/index.js";
  import * as Select from "#lib/components/ui/select/index.js";
  import {
    getSerialPorts,
    type SerialPortInfo,
  } from "./SerialConnections.remote";

  interface Props {
    path: RemoteFormField<string>;
    baudRate: RemoteFormField<number>;
  }

  let { baudRate, path }: Props = $props();
</script>

{#snippet pathItem(port: SerialPortInfo)}
  <div class="flex flex-1 justify-start items-center gap-2">
    <p class="font-medium">{port.path ?? "Undefined Path"}</p>
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
  <div class="col-span-3 space-y-1">
    <Select.Root
      type="single"
      allowDeselect={true}
      {...path.as("text")}
      bind:value={
        () => path.value(), (value) => path.set(value)}
    >
      <Select.Trigger class="w-full">
        {#snippet children()}
          {const currentPath = $derived(path.value())}
          {#if currentPath}
            {currentPath}
          {:else}
            Select Serial Path...
          {/if}
        {/snippet}
      </Select.Trigger>
      <Select.Content>
        {#each await getSerialPorts() as port}
          <Select.Item value={port.path} label={port.path}>
            {@render pathItem(port)}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>

    {#each path.issues() as issue}
      <p class="text-xs text-red-600">{issue.message}</p>
    {/each}
  </div>
</div>

<!-- Serial Baud Rate -->
<div class="grid grid-cols-4 items-center gap-4">
  <Label for="serialBaudRate" class="text-right">Baud Rate</Label>
  <Input id="serialBaudRate" {...baudRate.as("number")} class="col-span-3" />
</div>
