<script lang="ts">
  import type { ClientConnection } from "$lib/client/Connections/ClientConnection.svelte";
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
  import SerialConnection from "./Serial/SerialConnection.svelte";

  interface Props {
    connection: ClientConnection;
  }

  let { connection = $bindable() }: Props = $props();
</script>

<div class="flex-col flex gap-2">
  <!-- Connection Name -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="connName" class="text-right">Name</Label>
    <Input id="connName" bind:value={connection.name} class="col-span-3" />
  </div>

  <!-- Connection Protocol e.g. DCC Ex, LCC, etc. -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="connProtocol" class="text-right">Protocol</Label>
    <Select.Root
      type="single"
      name="connProtocol"
      bind:value={connection.protocol}
    >
      <Select.Trigger class="col-span-3">
        {getProtocolName(connection.protocol)}
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
    <Label for="connType" class="text-right">Hardware</Label>
    <Select.Root type="single" name="connType" bind:value={connection.hardware}>
      <Select.Trigger class="col-span-3">
        {getConnectionTypeName(connection.hardware)}
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

  {#if connection.hardware === "Serial"}
    <p>Serial editor goes here</p>
    <!-- <SerialConnection bind:serialPath bind:serialBaudRate /> -->
  {/if}
  <Separator />
</div>
