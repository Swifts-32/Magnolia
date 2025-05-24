<script lang="ts">
  import TrainAddDialog from "$lib/components/Settings/Trains/TrainAddDialog.svelte";
  import TrainEditDialog from "$lib/components/Settings/Trains/TrainEditDialog.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import { Plus, TrainFront } from "lucide-svelte";
  import { getLayoutClientState } from "$lib/client/LayoutClient.svelte";
  import { z } from "zod/v4";
  import type { TrainUuid } from "$lib/types/Trains/Train";

  const layout = getLayoutClientState();
  let curTrainId: TrainUuid | undefined = $state();

  async function loadTrains() {
    const response = await fetch(
      `/api/layout/${layout.uuid}/trains/loco-select`,
    );
    const json = await response.json();

    // Need train:
    // - Name
    // - Address
    // - Uuid
    // - Connection Name
    const Train = z.object({
      id: z.uuidv4(),
      name: z.string(),
      address: z.string(),
      connName: z.string().nullable(),
    });

    return z.array(Train).parse(json.trains);
  }
</script>

{#await curTrainId && layout.loadTrain(curTrainId) then train}
  {#if train}
    <TrainEditDialog
      bind:open={
        () => train !== undefined, (v) => v || (curTrainId = undefined)
      }
      {train}
    />
  {/if}
{/await}

<div class="m-4">
  <h1 class="text-4xl my-10">Trains</h1>

  <div class="flex flex-wrap gap-3">
    {#await loadTrains() then trains}
      {#each trains as train (train.id)}
        <!-- Display the dialog, When the selected train is this train -->
        <button
          onclick={() => (curTrainId = train.id as TrainUuid)}
          class="border-primary border-2 p-3 flex rounded-md w-[500px] gap-3 items-center h-20 select-none"
        >
          <TrainFront size={40} strokeWidth={1} />

          <p class="text-2xl text-start">{train.name}</p>
          <div class="flex-col flex items-start">
            <p class="text-sm text-gray-400">Addr: {train.address}</p>
            <p class="text-sm text-gray-400">
              Connection: {train.connName ?? "None"}
            </p>
          </div>
        </button>
      {/each}
    {/await}

    <TrainAddDialog
      layoutId={layout.uuid}
      class="border-primary border-2 p-3 flex rounded-md w-[500px] gap-3 items-center h-20 select-none"
    >
      <Plus size={40} strokeWidth={1} />
      <p class="text-2xl text-start">Add Train</p>
    </TrainAddDialog>
  </div>
</div>

<Toaster />
