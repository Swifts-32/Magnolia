<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { LayoutClient } from "$lib/client/LayoutClient.svelte";
  import { toast } from "svelte-sonner";
  import { type Snippet } from "svelte";
  import TrainEditor from "./TrainEditor.svelte";
  import { ClientTrain } from "$lib/client/Trains/Train.svelte";

  interface Props {
    layout: LayoutClient;
    class?: string;
    children?: Snippet;
  }
  let { layout, class: trainAddClass = "", children }: Props = $props();

  let editMode: boolean = $state(false);
  let train: ClientTrain | undefined = $state();

  $effect(() => {
    if (!train && editMode) {
      train = new ClientTrain(crypto.randomUUID(), layout.uuid);
    }
  });

  async function createTrain() {
    if (!train) {
      closeDialog();
      return;
    }

    fetch(`/api/layout/${layout.uuid}/trains/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: train.toJsonWeb(),
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
        toast.error("Error adding train: " + error);
      });

    closeDialog();
  }

  function closeDialog() {
    train = undefined;
    editMode = false;
  }
</script>

<button class={trainAddClass} onclick={() => (editMode = true)}>
  {@render children?.()}
</button>

{#if train}
  <Dialog.Root open={editMode}>
    <Dialog.Content
      onOpenAutoFocus={(e) => e.preventDefault()}
      interactOutsideBehavior="ignore"
      escapeKeydownBehavior="ignore"
    >
      <Dialog.Header>
        <Dialog.Title>Create Train</Dialog.Title>
      </Dialog.Header>

      <TrainEditor bind:train {layout} />

      <Dialog.Footer>
        <Button class="w-28" variant="outline" onclick={closeDialog}
          >Cancel</Button
        >
        <Button class="w-28" onclick={createTrain}>Create</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/if}
