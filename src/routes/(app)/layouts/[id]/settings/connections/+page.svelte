<script lang="ts">
  import {
    getConnectionTypeName,
    getProtocolName,
  } from "$lib/client/Protocols/protocols";
  import EditConnectionDialog from "$lib/components/Settings/Connections/EditConnectionDialog.svelte";
  import { getConnections } from "./connections.remote";
  import type { PageProps } from "./$types";
  import type { Connection } from "$lib/server/db/schema/connection";
  import Fab from "$lib/components/FAB/Fab.svelte";
  import { Plus } from "lucide-svelte";
  import AddConnectionDialog from "$lib/components/Settings/Connections/AddConnectionDialog.svelte";

  let { data }: PageProps = $props();
  let selConnection: Connection | undefined = $state();
</script>

<!-- <EditConnectionDialog bind:connection={selConnection} /> -->
<!-- <AddConnectionDialog layoutId={data.id} bind:open={isAddConnectionDialogOpen} /> -->

<!-- Add Connection Button -->
<AddConnectionDialog layoutId={data.id}>
  <Fab label="Add Connection">
    <Plus class="size-8" />
  </Fab>
</AddConnectionDialog>

<div class="m-4">
  <h1 class="text-4xl my-10">Connections</h1>

  <div class="flex flex-wrap gap-3">
    {#each await getConnections(data.id) as connection}
      <button
        class="border-primary cursor-pointer border-2 px-3 flex rounded-md gap-3 w-96 h-16 items-center select-none"
        onclick={() => (selConnection = connection)}
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
  </div>
</div>
