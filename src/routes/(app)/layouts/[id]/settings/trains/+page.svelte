<script lang="ts">
  import TrainAddDialog from "$lib/components/Settings/Trains/TrainAddDialog.svelte";
  import TrainEditDialog from "$lib/components/Settings/Trains/TrainEditDialog.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import { Layout, Plus, TrainFront } from "lucide-svelte";
  import { getLayoutClientState } from "$lib/client/LayoutClient.svelte";
  import { z } from "zod/v4";
  import type { TrainUuid } from "$lib/types/Trains/Train";
  import { createTrain, getTrains } from "./trains.remote";
  import type { LayoutProps, PageProps } from "../$types";
  import Button from "$lib/components/ui/button/button.svelte";
  import Fab from "$lib/components/FAB/Fab.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";

  let isDialogOpen = $state(false);

  // const layout = getLayoutClientState();
  let curTrainId: TrainUuid | undefined = $state();
  let { data }: LayoutProps = $props();

  // async function loadTrains() {
  //   const response = await fetch(
  //     `/api/layout/${layout.uuid}/trains/loco-select`,
  //   );
  //   const json = await response.json();

  //   // Need train:
  //   // - Name
  //   // - Address
  //   // - Uuid
  //   // - Connection Name
  //   const Train = z.object({
  //     id: z.uuidv4(),
  //     name: z.string(),
  //     address: z.string(),
  //     connName: z.string().nullable(),
  //   });

  //   return z.array(Train).parse(json.trains);
  // }
</script>

<!-- {#await curTrainId && layout.loadTrain(curTrainId) then train}
  {#if train}
    <TrainEditDialog
      bind:open={
        () => train !== undefined, (v) => v || (curTrainId = undefined)
      }
      {train}
    />
  {/if}
{/await} -->

<div class="m-4">
  <h1 class="text-4xl my-10">Trains</h1>

  <div class="flex flex-wrap gap-3">
    <svelte:boundary>
      {#each await getTrains(data.id) as train}
        <!-- Display the dialog, When the selected train is this train -->
        <button
          onclick={() => (curTrainId = train.uuid as TrainUuid)}
          class="border-primary border-2 p-3 flex rounded-md w-[500px] gap-3 items-center h-20 select-none"
        >
          <TrainFront size={40} strokeWidth={1} />

          <p class="text-2xl text-start">{train.name}</p>
          <div class="flex-col flex items-start">
            <p class="text-sm text-gray-400">Addr: {train.address}</p>
            <!-- <p class="text-sm text-gray-400">
            Connection: {train.connName ?? "None"}
          </p> -->
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
      <!-- {#await getTrains() then trains}
    {#each trains as train (train.id)}-->
      <!-- Display the dialog, When the selected train is this train -->
      <!-- <button
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
      {/each} -->
      <!-- {/await} -->

      <!-- <TrainAddDialog
        layoutId={data.id}
        class="border-primary border-2 p-3 flex rounded-md w-[500px] gap-3 items-center h-20 select-none"
      >
        <Plus size={40} strokeWidth={1} />
        <p class="text-2xl text-start">Add Train</p>
      </TrainAddDialog> -->
    </svelte:boundary>
  </div>
</div>

<!-- Add Train Button -->
<Fab onclick={() => (isDialogOpen = true)} label="Add Train">
  <Plus class="size-8" />
</Fab>

<!-- Add Train Dialog -->
<Dialog.Root bind:open={isDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Train</Dialog.Title>
    </Dialog.Header>

    <form {...createTrain}>
      <!-- Train Name -->
      <label class="grid grid-cols-4 mt-2 mb-3 items-center gap-4">
        <p>Train Name</p>
        <input
          class="border border-gray-300 col-span-3 rounded-md p-2 w-full"
          type="text"
          name="name"
          id="name"
          placeholder="New Layout"
          required
        />
      </label>

      <Dialog.Footer>
        <Button
          type="reset"
          onclick={() => (isDialogOpen = false)}
          variant="destructive"
          class="w-32">Cancel</Button
        >
        <Button type="submit" class="w-32">Submit</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
