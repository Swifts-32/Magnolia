<script lang="ts">
  import ConnectionSelector from "../Connections/ConnectionSelector.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import {
    type ConnectionUUID,
    LayoutClient,
  } from "$lib/client/LayoutClient.svelte";
  import { TrainFront, Trash2 } from "lucide-svelte";
  import type { ClientTrain } from "$lib/client/Trains/Train.svelte";
  import { toast } from "svelte-sonner";
  import { layoutClientHandler } from "../../../../services/Layouts/LayoutClientHandler.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  interface Props {
    train: ClientTrain;
    layout: LayoutClient;
  }

  let { train, layout }: Props = $props();

  let editMode: boolean = $state(false);

  let selectedConnectionUUID: ConnectionUUID = $state(train.connUUID);
  let trainName: string = $state(train.name);
  let trainAddress: string = $state(train.address.toString());

  async function saveChanges() {
    if (
      trainName === undefined ||
      trainAddress === undefined ||
      selectedConnectionUUID === undefined
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const data: any = {
      uuid: train.uuid,
      name: trainName,
      address: trainAddress,
      connUUID: selectedConnectionUUID,
    };

    fetch(`/api/layout/${layout.uuid}/trains/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (response.ok) {
          editMode = false; // Close the dialog on success
          toast.success("Train edited successfully");

          layoutClientHandler.refreshLayouts();
        } else {
          toast.error("Failed to edit train");
        }
      })

      .catch((error) => {
        toast.error("Error editing train: " + error);
      });
  }

  function deleteTrain() {
    if (!train.connUUID) {
      toast.error("Train is not connected to a connection");
      return;
    }

    const data = {
      uuid: train.uuid,
      connUUID: train.connUUID,
    };

    fetch(`/api/layout/${layout.uuid}/trains/delete`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

      .then(async (response) => {
        if (response.ok) {
          toast.success("Train deleted successfully");
          editMode = false;
          layoutClientHandler.refreshLayouts();
        } else {
          toast.error("Failed to delete train");
        }
      })
      .catch((error) => {
        toast.error("Error deleting train: " + error);
      });
  }
</script>

<button
  class="border-primary border-2 p-3 flex rounded-md w-[500px] gap-3 items-center h-20 select-none"
  onclick={() => (editMode = true)}
>
  <TrainFront size={40} strokeWidth={1} />

  <p class="text-2xl text-start">{train.name}</p>
  <div class="flex-col flex items-start">
    <p class="text-sm text-gray-400">Addr: {train.address}</p>
    <p class="text-sm text-gray-400">
      Connection: {layout.connections.get(train.connUUID)?.name ?? "None"}
    </p>
  </div>
</button>

<Dialog.Root open={editMode}>
  <Dialog.Content
    interactOutsideBehavior="ignore"
    escapeKeydownBehavior="ignore"
  >
    <Dialog.Header>
      <Dialog.Title>Edit Train</Dialog.Title>
    </Dialog.Header>

    <div class="w-full">
      <!-- Name -->
      <div class="grid grid-cols-4 my-2 items-center gap-4">
        <Label for="trainName" class="text-right">Name</Label>
        <Input id="trainName" bind:value={trainName} class="col-span-3" />
      </div>

      <!-- Address -->
      <div class="grid grid-cols-4 my-2 items-center gap-4">
        <Label for="trainAddress" class="text-right">Address</Label>
        <Input id="trainAddress" bind:value={trainAddress} class="col-span-3" />
      </div>

      <!-- Connection -->
      <ConnectionSelector
        connections={layout.connections}
        bind:selectedConnectionUUID
      />

      <!-- TODO Add functions -->

      <Separator class="mt-8" />

      <div class="flex justify-end my-4">
        <Button
          class="w-full bg-destructive text-destructive-foreground"
          onclick={deleteTrain}><Trash2 size={20} /> Delete Train</Button
        >
      </div>

      <Separator />
    </div>

    <Dialog.Footer>
      <Button
        type="reset"
        class="w-28"
        variant="outline"
        onclick={() => (editMode = false)}>Cancel</Button
      >
      <Button type="submit" class="w-28" onclick={saveChanges}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
