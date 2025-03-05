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
  import { type Snippet } from "svelte";
  import ConformationDialog from "../Common/ConformationDialog/ConformationDialog.svelte";

  interface Props {
    train: ClientTrain;
    layout: LayoutClient;
    class?: string;
    children?: Snippet;
  }

  let { train, layout, class: trainEditClass = "", children }: Props = $props();

  // Working copy of the train that will be edited
  let editableTrain: ClientTrain | null = $state(null);
  // Original train data for cancellation
  let currentTrain: ClientTrain | undefined;
  let editMode = $state(false);

  async function saveChanges() {
    if (!editableTrain) return;

    if (!editableTrain.name.trim())
      return toast.error("Please fill in the train name");
    if (!editableTrain.address)
      return toast.error("Please fill in the train address");
    if (!editableTrain.connUUID.trim())
      return toast.error("Please fill in the train connection");

    const data: ITrainData = {
      address: editableTrain.address,
      connUUID: editableTrain.connUUID,
      functions: Array.from(editableTrain.functions.values()),
      name: editableTrain.name,
      uuid: editableTrain.uuid,
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
          // Update the original train with edited values
          Object.assign(train, editableTrain);
          closeDialog();
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

  function deleteTrain() {
    if (!editableTrain || !editableTrain.connUUID.trim())
      return toast.error("Please fill in the train connection");

    const data = {
      uuid: editableTrain.uuid,
      connUUID: editableTrain.connUUID,
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

  function openDialog() {
    // Create fresh clones of the train each time dialog opens
    editableTrain = train.clone();
    currentTrain = train.clone(); // Save original state for potential cancellation
    editMode = true;

    if (editableTrain == null) closeDialog();
  }

  function closeDialog() {
    editMode = false;
    editableTrain = null; // Clear the editable train when closing
  }
</script>

<button class={trainEditClass} onclick={openDialog}>
  {@render children?.()}
</button>

<Dialog.Root
  bind:open={editMode}
  onOpenChange={(open) => !open && closeDialog()}
>
  <Dialog.Content
    onOpenAutoFocus={(e) => e.preventDefault()}
    interactOutsideBehavior="ignore"
    escapeKeydownBehavior="ignore"
  >
    <Dialog.Header>
      <Dialog.Title>Edit Train</Dialog.Title>
    </Dialog.Header>
    {#if editableTrain}
      <div class="w-full">
        <!-- Name -->
        <div class="grid grid-cols-4 my-2 items-center gap-4">
          <Label for="trainName" class="text-right">Name</Label>
          <Input
            id="trainName"
            bind:value={editableTrain.name}
            class="col-span-3"
          />
        </div>

        <!-- Address -->
        <div class="grid grid-cols-4 my-2 items-center gap-4">
          <Label for="trainAddress" class="text-right">Address</Label>
          <Input
            id="trainAddress"
            bind:value={editableTrain.address}
            class="col-span-3"
          />
        </div>

        <!-- Connection -->
        <ConnectionSelector
          connections={layout.connections}
          bind:selectedConnectionUUID={editableTrain.connUUID}
        />

        <Separator class="my-4" />

        <FunctionViewer bind:functions={editableTrain.functions} />

        <Separator class="my-4" />

        <ConformationDialog title="Delete Train">
          {#snippet trigger()}
            <Button variant="destructive" class="w-full"
              ><Trash2 /> Delete Train</Button
            >
          {/snippet}
          {#snippet primaryButton()}
            <Button variant="destructive" class="w-28" onclick={deleteTrain}
              >Delete Train</Button
            >
          {/snippet}
          {#snippet secondaryButton()}
            <Button variant="outline" class="w-28">Cancel</Button>
          {/snippet}
          <p>Are you sure you want to delete this train?</p>
        </ConformationDialog>

        <Separator class="mt-4" />
      </div>
    {/if}

    <Dialog.Footer>
      <Button type="reset" class="w-28" variant="outline" onclick={closeDialog}
        >Cancel</Button
      >
      <Button type="submit" class="w-28" onclick={saveChanges}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
