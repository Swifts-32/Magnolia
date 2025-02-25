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
  import { onMount, type Snippet } from "svelte";
  import type { ITrainData } from "$lib/types/Trains/Train";
  import { ClientTrain } from "$lib/client/Trains/Train.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import FunctionViewer from "./Functions/FunctionViewer.svelte";
  import type { TrainClientFunction } from "$lib/client/Trains/Functions/Function.svelte";

  interface Props {
    layout: LayoutClient;
    class?: string;
    children?: Snippet;
  }
  let { layout, class: trainAddClass = "", children }: Props = $props();

  let editMode: boolean = $state(false);

  let trainName: string | undefined = $state();
  let trainAddress: string | undefined = $state();
  let trainConnUUID: ConnectionUUID | undefined = $state();
  let trainFunctions: Map<string, TrainClientFunction> = $state(new Map());

  async function saveChanges() {
    if (!trainConnUUID?.trim())
      return toast.error("Please fill in the train connection");
    if (!trainName?.trim()) return toast.error("Please fill in the train name");
    if (!trainAddress?.trim())
      return toast.error("Please fill in the train address");

    const data: ITrainData = {
      name: trainName,
      address: trainAddress,
      connUUID: trainConnUUID,
      functions: Array.from(trainFunctions.values()),
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

<button class={trainAddClass} onclick={() => (editMode = true)}>
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
        bind:selectedConnectionUUID={trainConnUUID}
      />

      <Separator class="my-4" />

      <FunctionViewer bind:functions={trainFunctions} />

      <Separator class="mt-4" />
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
