<script lang="ts">
  import { Plus } from "lucide-svelte";
  import LayoutEdit from "$lib/components/Settings/Layouts/LayoutEdit.svelte";
  import { layoutClientHandler } from "../../../../services/Layouts/LayoutClientHandler.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import LayoutAdd from "$lib/components/Settings/Layouts/LayoutAdd.svelte";
</script>

<div class="m-4">
  <h1 class="text-4xl my-10">Layouts</h1>
  <div class="flex flex-wrap gap-3">
    {#each layoutClientHandler.layouts.values() as layout}
      <LayoutEdit {layout} />
    {/each}
  </div>
</div>
<Toaster/>
