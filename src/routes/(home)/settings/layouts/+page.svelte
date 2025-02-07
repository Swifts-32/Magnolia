<script lang="ts">
  import { Plus } from "lucide-svelte";
  import LayoutEdit from "$lib/components/Settings/Layouts/LayoutEdit.svelte";
  import { layoutClientHandler } from "../../../../services/Layouts/LayoutClientHandler";
  import { Toaster } from "$lib/components/ui/sonner";
</script>

<div class="m-4">
  <h1 class="text-4xl my-10">Layouts</h1>
  <div class="flex flex-wrap gap-3">
    {#each layoutClientHandler.getLayouts() as layout}
      <LayoutEdit {layout} />
    {/each}

    <button
      class="border-primary border-2 p-2 rounded-md w-96 h-16 select-none flex justify-center place-items-center"
    >
      <Plus size={40} />
      <p class="text-xl">Add new layout</p>
    </button>
  </div>
</div>
<Toaster/>
