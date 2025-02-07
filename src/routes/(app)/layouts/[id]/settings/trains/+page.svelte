<script lang="ts">
  import TrainAdd from "$lib/components/Settings/Trains/TrainAdd.svelte";
  import TrainEdit from "$lib/components/Settings/Trains/TrainEdit.svelte";
  import type { LayoutData } from "../../$types";
  
  let { data }: { data: LayoutData } = $props();
</script>

<div class="m-4">
  <h1 class="text-4xl my-10">Trains</h1>

  <div class="flex flex-wrap gap-3">
    {#each data.layout.getTrains() as train}
      <TrainEdit {train} layoutUUID={data.layout.uuid} />
    {/each}
    <TrainAdd layoutUUID={data.layout.uuid} />
  </div>
</div>
