<script lang="ts">
  import { Button } from "#lib/components/ui/button/index.js";
  import { ChevronLeft } from "@lucide/svelte";
  import {
    connectConnection,
    disconnectConnection,
    getConnection,
  } from "#lib/components/Connections/Connections.remote.js";
  import { Separator } from "#lib/components/ui/separator/index.js";
  import DccEx from "#lib/components/Connections/Protocols/DccEx/DccEx.svelte";
  import Lcc from "#lib/components/Connections/Protocols/Lcc/Lcc.svelte";
  import Sunbeam from "#lib/components/Connections/Protocols/Sunbeam/Sunbeam.svelte";

  let { params } = $props();

  const connectionQuery = $derived(getConnection(params.connectionId));
</script>

{#await connectionQuery}
  <p>Loading Connection</p>
{:then connection}
  <div class="flex flex-col gap-4 m-4">
    <div class="flex flex-row gap-2 justify-between items-center">
      <!-- Left Side -->
      <div class="flex items-center justify-between">
        <ChevronLeft onclick={() => window.history.back()} />
        <div>
          <h1 class="text-3xl font-bold tracking-tight">{connection.name}</h1>
          <!-- <p class="text-sm text-neutral-500">ID: {connection.uuid}</p> -->
          <p class="text-sm text-neutral-500">
            Protocol: {connection.protocol}
          </p>
          <p class="text-sm text-neutral-500">
            Type: {connection.hardware.type}
          </p>

          {#if connection.hardware.type === "Serial"}
            <p class="text-sm text-neutral-500">
              Port: {connection.hardware.path}
            </p>
            <p class="text-sm text-neutral-500">
              Baud Rate: {connection.hardware.baudRate}
            </p>
          {/if}
        </div>
      </div>

      <!-- Right Side -->
      <div class="flex items-center gap-4">
        {#if connection.isConnected}
          <Button
            onclick={async () => await disconnectConnection(connection.uuid)}
            >Disconnect</Button
          >
        {:else}
          <!-- Connect  -->
          <Button onclick={async () => await connectConnection(connection.uuid)}
            >Connect</Button
          >
        {/if}
      </div>
    </div>

    <Separator />

    {#if connection.isConnected}
      <div>
        {#if connection.protocol === "DccEx"}
          <DccEx connectionId={connection.uuid} />
        {:else if connection.protocol === "Lcc"}
          <Lcc connectionId={connection.uuid} />
        {:else if connection.protocol === "Sunbeam"}
          <Sunbeam connectionId={connection.uuid} />
        {/if}
      </div>
    {/if}
  </div>
{:catch error}
  <p>Error loading connection: {params.connectionId}</p>
  <p>{error}</p>
{/await}
