<script lang="ts">
  import type { ClientTrain } from "$lib/client/Trains/Train.svelte";
  import { Trash2 } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import ConformationDialog from "../Common/ConformationDialog/ConformationDialog.svelte";
  import TrainEditor from "./TrainEditor.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  interface Props {
    train: ClientTrain;
    open: boolean;
    class?: string;
  }

  let { train, open = $bindable() }: Props = $props();

  let editableTrain: ClientTrain | undefined = $state();

  $effect(() => {
    if (!editableTrain && open) {
      editableTrain = train.clone();
    }
  });

  async function deleteTrain() {
    if (!editableTrain) return;

    fetch(`/api/layout/${editableTrain.layoutUuid}/trains/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: editableTrain.toJsonWeb(),
    })
      .then(async (response) => {
        const json = await response.json();
        if (response.ok) {
          closeDialog();
          toast.success(json.message);
        } else {
          toast.error(json.message);
        }
      })
      .catch((error) => {
        toast.error("Error editing train: " + error);
      });
  }

  function updateTrain() {
    if (!editableTrain) {
      closeDialog();
      return;
    }

    fetch(`/api/layout/${editableTrain.layoutUuid}/trains/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: editableTrain.toJsonWeb(),
    })
      .then(async (response) => {
        const json = await response.json();
        if (response.ok) {
          toast.success(json.message);
        } else {
          toast.error(json.message);
        }
      })
      .catch((error) => {
        toast.error("Error deleting train: " + error);
      });

    closeDialog();
  }

  function closeDialog() {
    open = false;
    editableTrain = undefined;
  }
</script>

<Dialog.Root bind:open onOpenChange={(open) => !open && closeDialog()}>
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
        <TrainEditor bind:train={editableTrain} />

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
      <Button type="submit" class="w-28" onclick={updateTrain}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
