<script lang="ts">
  import {
    connectionProtocolList,
    connectionTypeList,
    getConnectionTypeName,
    getProtocolName,
  } from "$lib/client/Protocols/protocols";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import type { Connection } from "$lib/server/db/schema/connection";
  import SerialConnection from "./Serial/SerialConnection.svelte";

  interface Props {
    connection?: Connection | undefined;
  }

  let { connection = $bindable(undefined) }: Props = $props();

  let protocol = $state(connection?.protocol ?? undefined);
  let hardware = $state(connection?.hardware ?? undefined);
</script>

<div class="flex-col flex gap-2">
  <!-- Connection Name -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="name" class="text-right">Name</Label>
    <Input
      id="name"
      name="name"
      value={connection?.name}
      placeholder="Enter connection name"
      class="col-span-3"
    />
  </div>

  <!-- Connection Protocol e.g. DCC Ex, LCC, etc. -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="protocol" class="text-right">Protocol</Label>
    <Select.Root type="single" name="protocol" bind:value={protocol}>
      <Select.Trigger class="col-span-3">
        {protocol ? getProtocolName(protocol) : "Select Protocol"}
      </Select.Trigger>

      <Select.Content>
        {#each connectionProtocolList as protocolName}
          <Select.Item value={protocolName}>
            {getProtocolName(protocolName)}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>

  <Separator />

  <!-- Connection Type e.g. Serial, Bluetooth, etc. -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="hardware" class="text-right">Hardware</Label>
    <Select.Root type="single" name="hardware" bind:value={hardware}>
      <Select.Trigger class="col-span-3">
        {hardware ? getConnectionTypeName(hardware) : "Select Hardware"}
      </Select.Trigger>
      <Select.Content>
        {#each connectionTypeList as connType, i}
          <Select.Item value={connType}>
            {getConnectionTypeName(connType)}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>

  <!-- {#if connection.hardware === "Serial"}
    <p>Serial editor goes here</p>
    <SerialConnection bind:serialPath bind:serialBaudRate />
  {/if} -->
  <Separator />
</div>
