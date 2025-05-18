<script lang="ts">
  import type { LayoutUUID } from "$lib/client/LayoutClient.svelte";
  import { page } from "$app/state";
  import { Toaster } from "$lib/components/ui/sonner";
  import { layoutClientHandler } from "../../../../../../services/Layouts/LayoutClientHandler.svelte";
  import ConnectionEdit from "$lib/components/Settings/Layouts/ConnectionEdit.svelte";
  import AddConnectionDialog from "$lib/components/Settings/Connections/AddConnectionDialog.svelte";

  const layout = $derived(
    layoutClientHandler.layouts.get(page.params.id as LayoutUUID),
  );
</script>

{#if layout}
  <div class="m-4">
    <h1 class="text-4xl my-10">Connections</h1>

    <div class="flex flex-wrap gap-3">
      {#each layout.connections.values() as connection}
        <ConnectionEdit {connection} />
      {/each}

      <AddConnectionDialog {layout} />
    </div>
  </div>
{:else}
  <p>Error</p>
{/if}
<Toaster />
