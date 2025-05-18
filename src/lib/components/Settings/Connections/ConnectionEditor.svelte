<script lang="ts">
  import type { ClientConnection } from "$lib/client/Connections/ClientConnection.svelte";
  import {
    ConnectionProtocols,
    ConnectionTypes,
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

<div>
  <!-- Connection Name -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="connName" class="text-right">Name</Label>
    <Input id="connName" bind:value={connection.name} class="col-span-3" />
  </div>

  <!-- Connection Protocol e.g. DCC Ex, LCC, etc. -->
  <!-- <div class="grid grid-cols-4 items-center gap-4">
    <Label for="connProtocol" class="text-right">Protocol</Label>
    <Select.Root type="single" name="connProtocol" bind:value={connection.protocol}>
      <Select.Trigger class="w-80">
        {getProtocolName(Number(connProtocol) as ConnectionProtocols)}
      </Select.Trigger>
      <Select.Content>
        {#each Object.keys(ConnectionProtocols).filter( (key) => isNaN(Number(key)), ) as protocolName, i}
          <Select.Item
            value={ConnectionProtocols[
              protocolName as keyof typeof ConnectionProtocols
            ].toString()}
          >
            {getProtocolName(
              ConnectionProtocols[
                protocolName as keyof typeof ConnectionProtocols
              ],
            )}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div> -->

  <Separator />

  <!-- Connection Type e.g. Serial, Bluetooth, etc. -->
  <!-- <div class="grid grid-cols-4 items-center gap-4">
    <Label for="connType" class="text-right">Hardware</Label>
    <Select.Root type="single" name="connType" bind:value={connType}>
      <Select.Trigger class="col-span-3">
        {getConnectionTypeName(Number(connType) as ConnectionTypes)}
      </Select.Trigger>
      <Select.Content>
        {#each Object.keys(ConnectionTypes).filter( (key) => isNaN(Number(key)), ) as connType, i}
          <Select.Item
            value={ConnectionTypes[
              connType as keyof typeof ConnectionTypes
            ].toString()}
          >
            {getConnectionTypeName(
              ConnectionTypes[connType as keyof typeof ConnectionTypes],
            )}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div> -->
<!-- 
  {#if connType === ConnectionTypes.Serial.toString()}
    <SerialConnection bind:serialPath bind:serialBaudRate />
  {/if} -->
  <Separator />
</div>
