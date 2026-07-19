<script lang="ts">
  import { page } from "$app/state";
  import { getConnection } from "$lib/client/Connections.remote";
  import { getTrain } from "$lib/client/Trains.remote";
  // import EditTrainForm from "$lib/components/Trains/EditTrainForm.svelte";

  let { params } = $props();
</script>

{#await getTrain(params.trainId)}
  <p>Loading train: {params.trainId}</p>
{:then train}
  <div class="select-none">
    <h1 class="text-3xl">{train.name}</h1>
    <h3 class="text-muted-foreground/60">
      Address: {train.address}
    </h3>
    {#await getConnection(train.connectionUuid) then connection}
      <p class="text-sm text-gray-400">
        Connection: {connection.name}
      </p>
    {:catch}
      <p class="text-sm text-red-400">No Connection</p>
    {/await}

    {#key train}
      <!-- <EditTrainForm {train} /> -->
    {/key}
  </div>
{/await}
