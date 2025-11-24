<script lang="ts">
  import {
    connectionProtocolList,
    connectionTypeList,
    getConnectionTypeName,
  } from "$lib/client/Protocols/protocols";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import type { Connection } from "$lib/server/db/schema/connection";
  import { createConnection } from "../../../../routes/(app)/layouts/[id]/settings/connections/connections.remote";
  import SerialConnection from "./Serial/SerialConnection.svelte";

  interface Props {
    connection?: Connection | undefined;
  }

  let { connection = $bindable(undefined) }: Props = $props();

  const { name, hardware, protocol } = createConnection.fields;

  let protocol2 = $state(connection?.protocol ?? undefined);
  let hardware2 = $state(connection?.hardware ?? undefined);
</script>

<div class="flex-col flex gap-2">
  <!-- Connection Name -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="name" class="text-right">Name</Label>
    <Input
      id="name"
      placeholder="Enter connection name"
      class="col-span-3"
      {...name.as("text")}
    />
  </div>

  <!-- Connection Protocol e.g. DCC Ex, LCC, etc. -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="protocol" class="text-right">Protocol</Label>
    <select
      id="protocol"
      {...protocol.as("select")}
      class="flex h-10 col-span-3 items-center justify-between rounded-md border border-input
           bg-background px-3 py-2 text-sm ring-offset-background
           focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
           disabled:cursor-not-allowed disabled:opacity-50"
    >
      {#each connectionProtocolList as protocolName}
        <option
          value={protocolName}
          class="bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {protocolName}
        </option>
      {/each}
    </select>
  </div>

  <Separator />

  <!-- Connection Type e.g. Serial, Bluetooth, etc. -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="hardware" class="text-right">Hardware</Label>
    <select
      id="hardware"
      {...hardware.as("select")}
      class="flex h-10 col-span-3 items-center justify-between rounded-md border border-input
           bg-background px-3 py-2 text-sm ring-offset-background
           focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
           disabled:cursor-not-allowed disabled:opacity-50"
    >
      {#each connectionTypeList as connType}
        <option
          value={connType}
          class="bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {getConnectionTypeName(connType)}
        </option>
      {/each}
    </select>
  </div>

  <!-- {#if connection.hardware === "Serial"}
    <p>Serial editor goes here</p>
    <SerialConnection bind:serialPath bind:serialBaudRate />
  {/if} -->
  <Separator />
</div>
