<script lang="ts">
  import {
    getConnectionHardwareName,
    getProtocolName,
  } from "$lib/client/Connections/Protocols/protocols";
  import { getConnections } from "../../../../../../lib/client/Connections/connections.remote";
  import Fab from "$lib/components/FAB/Fab.svelte";
  import { Plus } from "lucide-svelte";
  import AddConnectionDialog from "$lib/components/Settings/Connections/AddConnectionDialog.svelte";
  import EditConnectionDialog from "$lib/components/Settings/Connections/EditConnectionDialog.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<!-- Add Connection Button -->
<AddConnectionDialog layoutId={data.id}>
  <Fab label="Add Connection">
    <Plus class="size-8" />
  </Fab>
</AddConnectionDialog>

<div class="m-4">
  <h1 class="text-4xl my-10">Connections</h1>

  <div class="flex flex-wrap gap-3">
    <!-- {#each await getConnections(data.id) as connection} -->
      <!-- <EditConnectionDialog {connection}>
        <div
          class="border-primary cursor-pointer border-2 px-3 flex rounded-md gap-3 w-96 h-16 items-center select-none"
        >
          <p class="text-xl">{connection.name}</p>
          <div class="flex-col flex items-start">
            <p class="text-sm text-gray-400">
              Protocol: {getProtocolName(connection.protocol)}
            </p>
            <p class="text-sm text-gray-400">
              Type: {getConnectionHardwareName(connection.hardware.type)}
            </p>
          </div>
        </div>
      </EditConnectionDialog> -->
    <!-- {/each} -->
  </div>
</div>
