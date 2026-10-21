<script lang="ts">
  import Fab from "$lib/components/FAB/Fab.svelte";
  import { Plus } from "@lucide/svelte";
  import AddConnectionDialog from "$lib/components/Connections/AddConnectionDialog.svelte";

  let { children, params } = $props();
</script>

<div class="flex">
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
