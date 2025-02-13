<script lang="ts">
  import TrainAdd from "$lib/components/Settings/Trains/TrainAdd.svelte";
  import TrainEdit from "$lib/components/Settings/Trains/TrainEdit.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import { Plus } from "lucide-svelte";
  import type { LayoutData } from "../../$types";

  let { data }: { data: LayoutData } = $props();
</script>

<div class="m-4">
  <h1 class="text-4xl my-10">Trains</h1>

  <div class="flex flex-wrap gap-3">
    {#each data.layout.getTrains().values() as train (train.uuid)}
      <TrainEdit {train} layout={data.layout} />
    {/each}
    <TrainAdd layout={data.layout}>
      <div
        class="border-primary border-2 p-3 flex rounded-md w-[500px] gap-3 items-center h-20 select-none"
      >
        <Plus size={40} strokeWidth={1} />
        <p class="text-2xl text-start">Add Train</p>
      </div>
    </TrainAdd>
  </div>
</div>
<Toaster />
