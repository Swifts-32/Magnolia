<script lang="ts">
  import ConnectionAdd from "$lib/components/Settings/Layouts/ConnectionAdd.svelte";
  import ConnectionEdit from "$lib/components/Settings/Layouts/ConnectionEdit.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import type { LayoutData } from "../../$types";

  let { data }: { data: LayoutData } = $props();
</script>

<div class="m-4">
  <h1 class="text-4xl my-10">Connections</h1>

  <div class="flex flex-wrap gap-3">
    {#each data.layout.connections.values() as connection}
      <ConnectionEdit {connection} />
    {/each}
    <ConnectionAdd layout={data.layout} />
  </div>
</div>
<Toaster />