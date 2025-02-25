<script lang="ts">
  import ConnectionSelector from "../Connections/ConnectionSelector.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { LayoutClient } from "$lib/client/LayoutClient.svelte";
  import { Trash2 } from "lucide-svelte";
  import type { ClientTrain } from "$lib/client/Trains/Train.svelte";
  import { layoutClientHandler } from "../../../../services/Layouts/LayoutClientHandler.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import FunctionViewer from "./Functions/FunctionViewer.svelte";
  import type { ITrainData } from "$lib/types/Trains/Train";
    import { toast } from "svelte-sonner";

  interface Props {
    train: ClientTrain;
    layout: LayoutClient;
    editMode?: boolean;
  }

  let { train, layout, editMode = $bindable(false) }: Props = $props();

  // Save the state of the old train, incase the user cancels the editing
  const currentTrain = train;
  async function saveChanges() {
    if (!train.name.trim()) return toast.error("Please fill in the train name");
    if (!train.address) return toast.error("Please fill in the train address");
    if (!train.connUUID.trim())
      return toast.error("Please fill in the train connection");

    const data: ITrainData = {
      address: train.address,
      connUUID: train.connUUID,
      functions: Array.from(train.functions.values()),
      name: train.name,
      uuid: train.uuid,
    };

    fetch(`/api/layout/${layout.uuid}/trains/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const json = await response.json();
        if (response.ok) {
          editMode = false; // Close the dialog on success
          toast.success(json.message);

          layoutClientHandler.refreshLayouts();
        } else {
          toast.error(json.message);
        }
      })
      .catch((error) => {
        toast.error("Error editing train: " + error);
      });
  }

  function cancelChanges() {
    editMode = false;
    train = currentTrain;
    layoutClientHandler.refreshLayouts();
  }

  function deleteTrain() {
    if (!train.connUUID.trim())
      return toast.error("Please fill in the train connection");

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
        const json = await response.json();
        if (response.ok) {
          toast.success(json.message);
          editMode = false;
          layoutClientHandler.refreshLayouts();
        } else {
          toast.error(json.message);
        }
      })
      .catch((error) => {
        toast.error("Error deleting train: " + error);
      });
  }
</script>

<Dialog.Root bind:open={editMode}>
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
        <Input id="trainName" bind:value={train.name} class="col-span-3" />
      </div>

      <!-- Address -->
      <div class="grid grid-cols-4 my-2 items-center gap-4">
        <Label for="trainAddress" class="text-right">Address</Label>
        <Input
          id="trainAddress"
          bind:value={train.address}
          class="col-span-3"
        />
      </div>

      <!-- Connection -->
      <ConnectionSelector
        connections={layout.connections}
        bind:selectedConnectionUUID={train.connUUID}
      />

      <Separator class="my-4" />

      <FunctionViewer bind:functions={train.functions} />

      <Separator class="mt-8" />

      <div class="flex justify-end my-4">
        <Button
          class="w-full bg-destructive text-destructive-foreground"
          onclick={deleteTrain}><Trash2 /> Delete Train</Button
        >
      </div>

      <Separator />
    </div>

    <Dialog.Footer>
      <Button
        type="reset"
        class="w-28"
        variant="outline"
        onclick={cancelChanges}>Cancel</Button
      >
      <Button type="submit" class="w-28" onclick={saveChanges}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
