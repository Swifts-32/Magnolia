<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import {
    type ConnectionUUID,
    LayoutClient,
  } from "$lib/client/LayoutClient.svelte";
  import { layoutClientHandler } from "../../../../services/Layouts/LayoutClientHandler.svelte";
  import { Plus } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import ConnectionSelector from "../Connections/ConnectionSelector.svelte";
  import type { Snippet } from "svelte";
    import type { ITrainData } from "$lib/types/Trains/Train";

  interface Props {
    layout: LayoutClient;
    children?: Snippet;
  }
  let { layout, children }: Props = $props();

  let editMode: boolean = $state(false);

  let selectedConnectionUUID: ConnectionUUID | undefined = $state();
  let trainName: string | undefined = $state();
  let trainAddress: string | undefined = $state();

  async function saveChanges() {
    if (
      trainName === undefined ||
      trainAddress === undefined ||
      selectedConnectionUUID === undefined
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const data: ITrainData = {
      name: trainName,
      address: trainAddress,
      connUUID: selectedConnectionUUID,
      functions: [],
      uuid: crypto.randomUUID(),
    };

    fetch(`/api/layout/${layout.uuid}/trains/add`, {
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
        toast.error("Error adding train: " + error);
      });
  }
</script>

<button class="w-full" onclick={() => (editMode = true)}>
  {@render children?.()}
</button>

<Dialog.Root open={editMode}>
  <Dialog.Content
    interactOutsideBehavior="ignore"
    escapeKeydownBehavior="ignore"
  >
    <Dialog.Header>
      <Dialog.Title>Add Train</Dialog.Title>
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
