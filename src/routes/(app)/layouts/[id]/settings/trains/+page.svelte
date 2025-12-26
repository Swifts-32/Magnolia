<script lang="ts">
  import type { LayoutProps } from "../$types";
  import { getTrains } from "../../../../../../lib/client/Trains/trains.remote";
  import { Plus, TrainFront } from "lucide-svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Fab from "$lib/components/FAB/Fab.svelte";
  import AddTrainDialog from "$lib/components/Settings/Trains/AddTrainDialog.svelte";
  import { getConnection } from "../../../../../../lib/client/Connections/connections.remote";
  import EditTrainDialog from "$lib/components/Settings/Trains/EditTrainDialog.svelte";

  let { data }: LayoutProps = $props();
</script>

<!-- Add Train Button -->
<AddTrainDialog layoutId={data.id}>
  <Fab label="Add Train">
    <Plus class="size-8" />
  </Fab>
</AddTrainDialog>

<div class="m-4">
  <h1 class="text-4xl my-10">Trains</h1>

  <div class="flex flex-wrap gap-3">
    <svelte:boundary>
      {#each await getTrains(data.id) as train}
        <EditTrainDialog {train}>
          <div
            class="border-primary cursor-pointer border-2 p-3 flex rounded-md w-[500px] gap-3 items-center h-20 select-none"
          >
            <TrainFront size={40} strokeWidth={1} />

            <p class="text-2xl text-start">{train.name}</p>
            <div class="flex-col flex items-start">
              <p class="text-sm text-gray-400">Address: {train.address}</p>

              {#await getConnection(train.connectionUuid) then connection}
                <p class="text-sm text-gray-400">
                  Connection: {connection.name}
                </p>
              {:catch}
                <p class="text-sm text-red-400">No Connection</p>
              {/await}
            </div>
          </div>
        </EditTrainDialog>
      {/each}

      {#snippet pending()}
        <p>loading...</p>
      {/snippet}

      {#snippet failed(error, reset)}
        <p>{error}</p>
        <Button onclick={reset}>Try Again</Button>
      {/snippet}
    </svelte:boundary>
  </div>
</div>
