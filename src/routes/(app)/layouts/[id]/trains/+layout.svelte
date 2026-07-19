<script lang="ts">
  import { page } from "$app/state";
  import Fab from "$lib/components/FAB/Fab.svelte";
  import { Plus, TrainFront } from "@lucide/svelte";
  import { goto } from "$app/navigation";
  import { getLayoutTrains } from "$lib/client/Trains.remote";
  import { getConnection } from "$lib/client/Connections.remote";
  import AddTrainDialog from "$lib/components/Trains/AddTrainDialog.svelte";

  let { children, params } = $props();
</script>

{#snippet trainConnectionName(connectionId: string)}
  {#await getConnection(connectionId)}
    <p>Loading Connection Info</p>
  {:then connection}
    <p class="text-sm text-gray-400">
      {connection.name}
    </p>
  {:catch}
    <p class="text-sm text-red-400">No Connection</p>
  {/await}
{/snippet}

<div class="flex h-screen border-t border-gray-700 w-full">
  <!-- Sidebar -->
  <aside
    class="w-fit min-w-30 bg-card border-r border-gray-700 shadow-sm flex flex-col"
  >
    <nav class="flex-1 flex flex-col m-1 space-y-2">
      {#each await getLayoutTrains(params.id) as train}
        {@const url = `/layouts/${params.id}/trains/${train.uuid}`}

        <button
          class="cursor-pointer p-3 flex rounded-md gap-3 items-center select-none {url ===
          page.url.pathname
            ? 'text-accent/50'
            : 'text-foreground hover:bg-accent/10 '}"
          onclick={() => goto(url)}
        >
          <!-- TODO Add customisable icon/image -->
          <TrainFront size={40} strokeWidth={1} />

          <p class="text-2xl text-start">{train.name}</p>
          <div class="flex-col flex items-start">
            <p class="text-sm text-gray-400">Address: {train.address}</p>

            {#if train.connectionUuid}
              {@render trainConnectionName(train.connectionUuid)}
            {/if}
          </div>
        </button>
      {/each}
    </nav>
  </aside>

  <!-- Main content -->
  <main class="flex-1 py-8 px-6">
    {@render children()}
  </main>
</div>

<!-- Add Train Button -->
<AddTrainDialog layoutId={params.id}>
  <Fab label="Add Train">
    <Plus class="size-8" />
  </Fab>
</AddTrainDialog>
