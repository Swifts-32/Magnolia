<script lang="ts">
  import { page } from "$app/state";
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import DccEx from "$lib/components/Protocols/DccEx.svelte";
  import Lcc from "$lib/components/Protocols/Lcc/Lcc.svelte";
  import { Pen } from "lucide-svelte";
  import {
    connectConnection,
    disconnectConnection,
    getConnection,
  } from "$lib/client/Connections.remote";
  import EditConnectionDialog from "$lib/components/Connections/EditConnectionDialog.svelte";

  const connection = $derived(await getConnection(page.params.connectionId));
</script>

<div class="flex flex-col grow min-w-80 max-w-110 gap-4">
  <div class="flex flex-row gap-2 justify-between items-center">
    <!-- Left Side -->
    <div>
      <h1 class="text-3xl">{connection.name}</h1>
      <h3 class="text-muted-foreground/60">
        Type: {connection.hardware.type}
      </h3>
      <h3 class="text-muted-foreground/60">
        Protcol: {connection.protocol}
      </h3>
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
            const res = await disconnectConnection(connection.uuid);
            if (res.sucess) {
              toast.success("Connection disconnected");
            } else {
              toast.error("Error while disconnecting");
            }
          }}>Disconnect</Button
        >
      {:else}
        <!-- Connect  -->
        <!-- TODO Add loading state -->
        <Button
          onclick={async () => {
            const res = await connectConnection(connection.uuid);
            if (res.error) {
              toast.error("Error while connecting: " + res.error);
            } else {
              toast.success("Connection connected");
            }
          }}>Connect</Button
        >
      {/if}
    </div>
  </div>

  <div>
    {#if connection.isConnected}
      {#if connection.protocol === "DccEx"}
        <DccEx connectionId={connection.uuid} />
      {:else if connection.protocol === "Lcc"}
        <Lcc connectionId={connection.uuid} />
      {/if}
    {/if}
  </div>
</div>
