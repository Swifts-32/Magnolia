<script lang="ts">
  import type { PageProps } from "./$types";
  import * as Card from "$lib/components/ui/card/index.js";
  import {
    connectConnection,
    unloadConnection,
    getConnections,
  } from "./settings/connections/connections.remote";
  import { Button } from "$lib/components/ui/button";
  import DccEx from "$lib/components/Protocols/DccEx.svelte";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.name} Home</title>
</svelte:head>

<p>Session Id: {data.sessionId}</p>
<p>Connections</p>

<div class="flex flex-wrap gap-4 m-4">
  {#each await getConnections(data.id) as connection}
    <Card.Root class="w-100">
      <Card.Header>
        <Card.Title>{connection.name}</Card.Title>
        <Card.Description>{connection.hardware.type}</Card.Description>
      </Card.Header>
      <Card.Content>
        {#if connection.isConnected}
          <Button onclick={() => unloadConnection(connection.uuid)}
            >Disconnect</Button
          >
        {:else}
          <Button onclick={() => connectConnection(connection.uuid)}
            >Connect</Button
          >
        {/if}

        {#if connection.protocol === "DccEx"}
          <DccEx connectionId={connection.uuid}/>
        {:else}
          <p>No Custom Commands</p>
        {/if}
      </Card.Content>
      <Card.Footer>
        <p>Card Footer</p>
      </Card.Footer>
    </Card.Root>
  {/each}
</div>
