<script lang="ts">
  import type { Train, TrainFunction } from "$lib/server/db/schema/trains";
  import { Plus, TrainFront, Trash2 } from "lucide-svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import {
    deleteTrain,
    editTrain,
  } from "../../../../routes/(app)/layouts/[id]/settings/trains/trains.remote";
  import { getConnection } from "../../../../routes/(app)/layouts/[id]/settings/connections/connections.remote";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { toast } from "svelte-sonner";
  import ConnectionSelector from "../Connections/ConnectionSelector.svelte";
  import FunctionViewer from "./Functions/FunctionViewer.svelte";
  import FunctionSelector from "./Functions/FunctionSelector.svelte";
  import { createDefaultTrainFunction } from "../../../../routes/(app)/layouts/[id]/settings/trains/trainFunctions.remote";

  interface Props {
    train: Train;
  }

  let { train }: Props = $props();

  let isDialogOpen = $state(false);
  let isDelTrainDiaOpen = $state(false);

  let selFunction: TrainFunction | undefined = $state();
</script>

<!-- Train Widget -->
<button
  onclick={() => (isDialogOpen = true)}
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

<!-- Edit Train Dialog -->
<Dialog.Root bind:open={isDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Edit Train</Dialog.Title>
    </Dialog.Header>

    <form
      {...editTrain.enhance(async ({ submit, form, data: sd }) => {
        sd.set("layoutUuid", train.layoutUuid);
        sd.set("uuid", train.uuid);

        isDialogOpen = false;

        try {
          await submit();
          toast.success("Edited train");
        } catch (error) {
          toast.error("Error editing train: " + error);
        } finally {
          form.reset();
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
          value={train.name}
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
          value={train.comment}
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
          value={train.address}
          required
        />
      </label>

      <!-- Connection Selector -->
      <label class="grid grid-cols-4 mt-2 mb-3 items-center gap-4">
        <p>Connection</p>
        <ConnectionSelector
          layoutId={train.layoutUuid}
          selConnectionId={train.connectionUuid}
        />
      </label>

      <div class="my-2 mb-5 items-center gap-4 w-full grid grid-cols-8">
        <div class="col-span-5">
          <FunctionSelector bind:selFunction trainId={train.uuid} />
        </div>

        <!-- Add Function Button -->
        <Button
          class="w-full col-span-3"
          variant="outline"
          onclick={async () => await createDefaultTrainFunction(train.uuid)}
        >
          <Plus />Add Function
        </Button>
      </div>

      <FunctionViewer trainId={train.uuid} bind:selFunction />

      <Separator class="mb-3" />

      <!-- Delete Train Button -->
      <Button
        onclick={() => (isDelTrainDiaOpen = true)}
        variant="destructive"
        class="w-full mb-3"
      >
        <Trash2 /> Delete Train
      </Button>

      <!-- Delete Train Dialog -->
      <Dialog.Root bind:open={isDelTrainDiaOpen}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Delete Train</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to delete this train?
            </Dialog.Description>
          </Dialog.Header>

          <form
            id="delete-train-form"
            {...deleteTrain.enhance(async ({ submit, form, data: sd }) => {
              sd.set("trainId", train.uuid);
              sd.set("layoutId", train.layoutUuid);

              isDelTrainDiaOpen = false;
              isDialogOpen = false;

              try {
                await submit();
                toast.success("Deleted train");
              } catch (error) {
                toast.error("Error deleting train: " + error);
              } finally {
                form.reset();
                isDialogOpen = false;
                isDelTrainDiaOpen = false;
              }
            })}
          ></form>

          <Dialog.Footer>
            <Button
              type="reset"
              onclick={() => (isDelTrainDiaOpen = false)}
              variant="outline"
              class="w-32">Cancel</Button
            >
            <Button
              type="submit"
              variant="destructive"
              form="delete-train-form"
              class="w-32">Delete Train</Button
            >
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

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
