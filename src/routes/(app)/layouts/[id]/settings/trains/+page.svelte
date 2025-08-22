<script lang="ts">
  import type { LayoutProps } from "../$types";
  import { createTrain, getTrains } from "./trains.remote";
  import { toast } from "svelte-sonner";
  import { Plus } from "lucide-svelte";
  import TrainWidget from "$lib/components/Settings/Trains/TrainWidget.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import Fab from "$lib/components/FAB/Fab.svelte";
  import ConnectionSelector from "$lib/components/Settings/Connections/ConnectionSelector.svelte";

  let { data }: LayoutProps = $props();

  let isDialogOpen = $state(false);
</script>

<div class="m-4">
  <h1 class="text-4xl my-10">Trains</h1>

  <div class="flex flex-wrap gap-3">
    <svelte:boundary>
      {#each await getTrains(data.id) as train}
        <TrainWidget {train} />
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

<!-- Add Train Dialog -->
<Dialog.Root open={isDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Train</Dialog.Title>
    </Dialog.Header>

    <form
      id="create-train-form"
      {...createTrain.enhance(async ({ submit, form, data: sd }) => {
        sd.set("layoutUuid", data.id);

        try {
          isDialogOpen = false;
          await submit();
          form.reset();
          toast.success("Created train");
        } catch (error) {
          toast.error("Error creating train: " + error + "  " + data.id);
        } finally {
          isDialogOpen = false;
        }
      })}
    >
      <!-- Train Name -->
      <label class="grid grid-cols-4 mt-2 mb-3 items-center gap-4">
        <p>Name</p>
        <input
          class="border border-gray-300 col-span-3 rounded-md p-2 w-full"
          type="text"
          name="name"
          id="name"
          placeholder="Thomas"
          required
        />
      </label>

      <!-- Train Description -->
      <label class="grid grid-cols-4 mt-2 mb-3 items-center gap-4">
        <p>Description</p>
        <input
          class="border border-gray-300 col-span-3 rounded-md p-2 w-full"
          type="text"
          name="comment"
          id="comment"
          placeholder="This is a steam train"
          required
        />
      </label>

      <!-- Train Address -->
      <label class="grid grid-cols-4 mt-2 mb-3 items-center gap-4">
        <p>Address</p>
        <input
          class="border border-gray-300 col-span-3 rounded-md p-2 w-full"
          type="text"
          name="address"
          id="address"
          placeholder="e.g. 135"
          required
        />
      </label>

      <!-- Connection -->
      <label class="grid grid-cols-4 mt-2 mb-3 items-center gap-4">
        <p>Connection</p>
        <ConnectionSelector layoutId={data.id} />
      </label>
    </form>

    <Dialog.Footer>
      <Button
        onclick={() => (isDialogOpen = false)}
        variant="destructive"
        class="w-32">Cancel</Button
      >
      <Button type="submit" form="create-train-form" class="w-32">Submit</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
