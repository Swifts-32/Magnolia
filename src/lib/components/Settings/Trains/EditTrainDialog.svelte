<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { toast } from "svelte-sonner";
  import {
    deleteTrain,
    editTrain,
  } from "../../../../routes/(app)/layouts/[id]/settings/trains/trains.remote";
  import TrainFormContent from "./TrainFormContent.svelte";
  import type { Train } from "$lib/server/db/schema/trains";
  import ConformationDialog from "../Common/ConformationDialog/ConformationDialog.svelte";
  import { Trash2 } from "lucide-svelte";

  interface Props {
    train: Train | undefined;
  }

  let { train = $bindable() }: Props = $props();

  function closeDialog() {
    train = undefined;
  }
</script>

<Dialog.Root
  bind:open={() => train !== undefined, (v) => v || (train = undefined)}
>
  <Dialog.Content>
    <Dialog.Title>Edit Train</Dialog.Title>

    <form
      id="edit-train-form"
      {...editTrain.enhance(async ({ submit, form, data: sd }) => {
        if (train) {
          sd.set("layoutUuid", train.layoutUuid);
          sd.set("uuid", train.uuid);
        }

        closeDialog();
        try {
          await submit();
          form.reset();
          toast.success("Edited train");
        } catch (error) {
          toast.error("Error editing train: " + error);
        }
      })}
    >
      {#if train}
        <TrainFormContent layoutId={train.layoutUuid} {train} />
      {/if}
    </form>

    <!-- Delete Train -->
    <ConformationDialog title="Delete Train">
      {#snippet trigger()}
        <Button class="w-full mb-3" variant="destructive">
          <Trash2 />Delete Train
        </Button>
      {/snippet}
      {#snippet primaryButton()}
        <Button
          variant="destructive"
          class="w-32"
          onclick={() => {
            if (train) {
              deleteTrain(train.uuid);
              closeDialog();
            }
          }}
        >
          Delete Train</Button
        >
      {/snippet}
      {#snippet secondaryButton()}
        <Button variant="outline" class="w-32">Cancel</Button>
      {/snippet}
      <p>Are you sure you want to delete this train?</p>
    </ConformationDialog>

    <Dialog.Footer>
      <Button type="reset" class="w-28" variant="outline" onclick={closeDialog}
        >Cancel</Button
      >
      <Button type="submit" form="edit-train-form" class="w-28">Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
