<script lang="ts">
  import type { PageProps } from "./$types";
  import * as Card from "$lib/components/ui/card/index.js";
  import {
    connectConnection,
    unloadConnection,
    getConnections,
  } from "../../../../lib/client/Connections/connections.remote";
  import { Button } from "$lib/components/ui/button";
  import DccEx from "$lib/components/Protocols/DccEx.svelte";
  import Lcc from "$lib/components/Protocols/Lcc/Lcc.svelte";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.name} - Home</title>
</svelte:head>

<div class="flex flex-wrap gap-4 m-4">
  {#each await getConnections(data.id) as connection}
    <Card.Root class="w-100">
      <Card.Header class="flex flex-row gap-2 justify-between items-center">
        <!-- Left Side -->
        <div>
          <Card.Title>{connection.name}</Card.Title>
          <Card.Description>{connection.hardware.type}</Card.Description>
        </div>

        <!-- Right Side -->
        <div>
          {#if connection.isConnected}
            <Button
              onclick={() => {
                unloadConnection(connection.uuid);
                getConnections(data.id).refresh();
              }}>Disconnect</Button
            >
          {:else}
            <Button
              onclick={() => {
                connectConnection(connection.uuid);
                getConnections(data.id).refresh();
              }}>Connect</Button
            >
          {/if}
        </div>
      </Card.Header>
      <Card.Content>
        {#if connection.isConnected}
          {#if connection.protocol === "DccEx"}
            <DccEx connectionId={connection.uuid} />
          {:else if connection.protocol === "Lcc"}
            <Lcc connectionId={connection.uuid} />
          {:else}
            <p>No Custom Commands</p>
          {/if}
        {:else}
          <p>Connection is not connected</p>
        {/if}
      </Card.Content>
    </Card.Root>
  {/each}
</div>
