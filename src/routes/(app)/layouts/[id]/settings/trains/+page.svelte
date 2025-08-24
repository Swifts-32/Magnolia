<script lang="ts">
  import type { LayoutProps } from "../$types";
  import { getTrains } from "./trains.remote";
  import { Plus, TrainFront } from "lucide-svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Fab from "$lib/components/FAB/Fab.svelte";
  import AddTrainDialog from "$lib/components/Settings/Trains/AddTrainDialog.svelte";
  import { getConnection } from "../connections/connections.remote";
  import type { Train } from "$lib/server/db/schema/trains";
  import EditTrainDialog from "$lib/components/Settings/Trains/EditTrainDialog.svelte";

  let { data }: LayoutProps = $props();

  let isDialogOpen = $state(false);
  let selTrain: Train | undefined = $state();
</script>

<EditTrainDialog bind:train={selTrain} />

<div class="m-4">
  <h1 class="text-4xl my-10">Trains</h1>

  <div class="flex flex-wrap gap-3">
    <svelte:boundary>
      {#each await getTrains(data.id) as train}
        <button
          onclick={() => (selTrain = train)}
          class="border-primary cursor-pointer border-2 p-3 flex rounded-md w-[500px] gap-3 items-center h-20 select-none"
        >
          <TrainFront size={40} strokeWidth={1} />

          <p class="text-2xl text-start">{train.name}</p>
          <div class="flex-col flex items-start">
            <p class="text-sm text-gray-400">Address: {train.address}</p>

            {#await getConnection(train.connectionUuid) then connection}
              <p class="text-sm text-gray-400">Connection: {connection.name}</p>
            {:catch}
              <p class="text-sm text-red-400">No Connection</p>
            {/await}
          </div>
        </button>
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

<!-- Add Train Button -->
<Fab onclick={() => (isDialogOpen = true)} label="Add Train">
  <Plus class="size-8" />
</Fab>

<AddTrainDialog bind:open={isDialogOpen} layoutId={data.id} />
