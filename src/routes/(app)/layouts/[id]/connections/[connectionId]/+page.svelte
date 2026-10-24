<script lang="ts">
  import { Button } from "#lib/components/ui/button/index.js";
  import { toast } from "svelte-sonner";
  import DccEx from "#lib/components/Protocols/DccEx.svelte";
  import Lcc from "#lib/components/Protocols/Lcc/Lcc.svelte";
  import { ChevronLeft, Pen } from "@lucide/svelte";
  import {
    connectConnection,
    disconnectConnection,
    getConnection,
    getlayoutConnections,
  } from "#lib/client/Connections.remote.js";
  import EditConnectionDialog from "#lib/components/Connections/EditConnectionDialog.svelte";
  import { Separator } from "#lib/components/ui/separator/index.js";

  let { params } = $props();
  const connection = $derived(await getConnection(params.connectionId));
</script>

<!-- {#await getConnection(params.connectionId)}
  <p>Loading Connection</p>
{:then connection} -->
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
      <EditConnectionDialog {connection}>
        <div>
          <Pen />
        </div>
      </EditConnectionDialog>

      {#if connection.isConnected}
        <Button
          onclick={async () => {
            try {
              await disconnectConnection(connection.uuid).updates(
                getConnection(connection.uuid),
                getlayoutConnections(connection.layoutUuid),
              );
            } catch (error) {
              toast.error("Error while disconnecting");
            }
          }}>Disconnect</Button
        >
      {:else}
        <!-- Connect  -->
        <!-- TODO Add loading state -->
        <Button
          onclick={async () => {
            try {
              await connectConnection(connection.uuid).updates(
                getConnection(connection.uuid),
                getlayoutConnections(connection.layoutUuid),
              );
            } catch (error) {
              toast.error("Error while connecting.");
            }
          }}>Connect</Button
        >
      {/if}
    </div>
  </div>

  <Separator />

  <div>
    {#if connection.isConnected}
      <!-- {#key connection.isConnected} -->
      {#if connection.protocol === "DccEx"}
        <DccEx connectionId={connection.uuid} />
      {:else if connection.protocol === "Lcc"}
        <Lcc connectionId={connection.uuid} />
      {/if}
      <!-- {/key} -->
    {/if}
  </div>
</div>
<!-- {:catch error}
  <p>Error loading connection: {params.connectionId}</p>
  <p>{error}</p>
{/await} -->
