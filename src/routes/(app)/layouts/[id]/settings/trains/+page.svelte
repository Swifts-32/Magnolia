<script lang="ts">
  import type { LayoutData } from "../../$types";
  import TrainEdit from "$lib/components/Settings/Trains/trainEdit.svelte";
  let { data }: { data: LayoutData } = $props();
</script>


<div class="m-4">
  <h1 class="text-4xl my-10">Trains</h1>

  <div class="flex flex-wrap gap-3">
    {#each data.Layout.getTrains() as train}
      <TrainEdit {train} layoutUUID={data.Layout.name} />
    {/each}
  </div>
</div>

