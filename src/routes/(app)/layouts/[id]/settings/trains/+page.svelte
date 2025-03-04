<script lang="ts">
  import TrainAddDialog from "$lib/components/Settings/Trains/TrainAddDialog.svelte";
  import TrainEditDialog from "$lib/components/Settings/Trains/TrainEditDialog.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import { Plus, TrainFront } from "lucide-svelte";
  import type { LayoutData } from "../../$types";

  let { data }: { data: LayoutData } = $props();
</script>

<div class="m-4">
  <h1 class="text-4xl my-10">Trains</h1>

  <div class="flex flex-wrap gap-3">
    {#each data.layout.trains.values() as train (train.uuid)}
      <!-- Display the dialog, When the selected train is this train -->
      <TrainEditDialog
        {train}
        layout={data.layout}
        class="border-primary border-2 p-3 flex rounded-md w-[500px] gap-3 items-center h-20 select-none"
      >
        <TrainFront size={40} strokeWidth={1} />

        <p class="text-2xl text-start">{train.name}</p>
        <div class="flex-col flex items-start">
          <p class="text-sm text-gray-400">Addr: {train.address}</p>
          <p class="text-sm text-gray-400">
            Connection: {data.layout.connections.get(train.connUUID)?.name ??
              "None"}
          </p>
        </div>
      </TrainEditDialog>
    {/each}
    <TrainAddDialog
      layout={data.layout}
      class="border-primary border-2 p-3 flex rounded-md w-[500px] gap-3 items-center h-20 select-none"
    >
      <Plus size={40} strokeWidth={1} />
      <p class="text-2xl text-start">Add Train</p>
    </TrainAddDialog>
  </div>
</div>

<Toaster />
