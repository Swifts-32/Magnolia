<script lang="ts">
  import TrainAdd from "$lib/components/Settings/Trains/TrainAdd.svelte";
  import TrainEdit from "$lib/components/Settings/Trains/TrainEdit.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import type { LayoutData } from "../../$types";

  let { data }: { data: LayoutData } = $props();
</script>

<div class="m-4">
  <h1 class="text-4xl my-10">Trains</h1>

  <div class="flex flex-wrap gap-3">
    {#each data.layout.trains.values() as train}
      <TrainEdit {train} layout={data.layout} />
    {/each}
    <TrainAdd layout={data.layout} />
  </div>
</div>
<Toaster />
