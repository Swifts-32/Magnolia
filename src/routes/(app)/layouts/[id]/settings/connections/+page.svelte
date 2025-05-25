<script lang="ts">
  import { z } from "zod/v4";
  import {
    getLayoutClientState,
    type ConnectionUUID,
  } from "$lib/client/LayoutClient.svelte";
  import AddConnectionDialog from "$lib/components/Settings/Connections/AddConnectionDialog.svelte";
  import {
    ConnectionProtocol,
    ConnectionType,
    getConnectionTypeName,
    getProtocolName,
  } from "$lib/client/Protocols/protocols";
  import EditConnectionDialog from "$lib/components/Settings/Connections/EditConnectionDialog.svelte";

  const layout = getLayoutClientState();
  let selConnectionId: ConnectionUUID | undefined = $state();

  // Refresh the list of trains when the combobox is opened
  async function loadConnections() {
    const response = await fetch(
      `/api/layout/${layout.uuid}/connections/connection-select`,
    );
    const json = await response.json();

    const Connection = z.object({
      id: z.uuidv4(),
      name: z.string(),
      protocol: ConnectionProtocol,
      hardware: ConnectionType,
    });

    return z.array(Connection).parse(json.connections);
  }
</script>

{#await selConnectionId && layout.loadConnection(selConnectionId) then connection}
  {#if connection}
    <EditConnectionDialog
      bind:open={
        () => connection !== undefined,
        (v) => v || (selConnectionId = undefined)
      }
      {connection}
    />
  {/if}
{/await}

<div class="m-4">
  <h1 class="text-4xl my-10">Connections</h1>

  <div class="flex flex-wrap gap-3">
    {#await loadConnections() then connections}
      {#each connections as connection}
        <button
          class="border-primary border-2 px-3 flex rounded-md gap-3 w-96 h-16 items-center select-none"
          onclick={() => (selConnectionId = connection.id as ConnectionUUID)}
        >
          <p class="text-xl">{connection.name}</p>
          <div class="flex-col flex items-start">
            <p class="text-sm text-gray-400">
              Protocol: {getProtocolName(connection.protocol)}
            </p>
            <p class="text-sm text-gray-400">
              Type: {getConnectionTypeName(connection.hardware)}
            </p>
          </div>
        </button>
      {/each}
    {/await}

    <AddConnectionDialog {layout} />
  </div>
</div>
