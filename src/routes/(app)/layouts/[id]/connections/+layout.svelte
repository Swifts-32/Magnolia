<script lang="ts">
  import Fab from "$lib/components/FAB/Fab.svelte";
  import { Plus } from "@lucide/svelte";
  import { getlayoutConnections } from "$lib/client/Connections.remote";
  import AddConnectionDialog from "$lib/components/Connections/AddConnectionDialog.svelte";
  import { page } from "$app/state";

  let { children, params } = $props();
  const connections = $derived(await getlayoutConnections(params.id));
</script>

<div class="flex h-screen border-t border-gray-700">
  <!-- Sidebar -->
  <aside class="w-fit bg-card border-r border-gray-700 shadow-sm flex flex-col">
    <nav class="flex-1 py-2 pr-4 space-y-2">
      <!-- {#await getlayoutConnections(params.id)}
      <p>Loading</p>
      {:then connections} -->
      {#each connections as connection}
        {const url = `/layouts/${params.id}/connections/${connection.uuid}`}
        <div class="flex items-center py-2 px-4 gap-2">
          <div
            class="size-4 rounded-full {connection.isConnected
              ? 'bg-green-600'
              : 'bg-red-600'}"
          ></div>

          {#if url == page.url.pathname}
            <div class="block text-primary-disabled text-lg font-medium">
              {connection.name}
            </div>
          {:else}
            <a
              href={url}
              class="block text-card-foreground text-lg font-medium hover:text-primary transition-colors"
            >
              {connection.name}
            </a>
          {/if}
        </div>
      {/each}
      <!-- {:catch error}
      <p>Error: {error}</p>
      {/await} -->
    </nav>
  </aside>

  <!-- Main content -->
  <main class="flex-1 py-8 px-6 overflow-y-auto">
    {@render children()}
  </main>

  <!-- Add Connection Button -->
  <AddConnectionDialog layoutId={params.id}>
    <Fab label="Add Connection">
      <Plus class="size-8" />
    </Fab>
  </AddConnectionDialog>
</div>
