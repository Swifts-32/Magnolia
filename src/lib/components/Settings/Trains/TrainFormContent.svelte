<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import type { Train, TrainFunction } from "$lib/server/db/schema/trains";
  import { Plus } from "lucide-svelte";
  import ConnectionSelector from "../Connections/ConnectionSelector.svelte";
  import FunctionSelector from "./Functions/FunctionSelector.svelte";
  import { createDefaultTrainFunction } from "../../../../routes/(app)/layouts/[id]/settings/trains/trainFunctions.remote";
  import FunctionViewer from "./Functions/FunctionViewer.svelte";

  interface Props {
    train?: Train | undefined;
    layoutId: string;
  }

  let { train = $bindable(undefined), layoutId }: Props = $props();

  let selFunction: TrainFunction | undefined = $state();
</script>

<div class="flex-col flex gap-2">
  <!-- Train Name -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="name" class="text-right">Name</Label>
    <Input
      id="name"
      name="name"
      value={train?.name}
      placeholder="Enter train name"
      class="col-span-3"
    />
  </div>

  <!-- Train Description -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="comment" class="text-right">Description</Label>
    <Input
      id="comment"
      name="comment"
      value={train?.comment}
      placeholder="Enter train description"
      class="col-span-3"
    />
  </div>

  <!-- Train Address -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="address" class="text-right">Address</Label>
    <Input
      id="address"
      name="address"
      value={train?.address}
      placeholder="Enter train address"
      class="col-span-3"
    />
  </div>

  <!-- Train Connections -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="connectionId" class="text-right">Connections</Label>
    <ConnectionSelector {layoutId} />
  </div>

  <!-- Train Functions -->
  <!-- Function Selector -->
  <div class="my-2 mb-5 items-center gap-4 w-full grid grid-cols-8">
    <div class="col-span-5">
      {#if train}
        <FunctionSelector bind:selFunction trainId={train.uuid} />
      {/if}
    </div>

    <!-- Add Function Button -->
    <Button
      class="w-full col-span-3"
      variant="outline"
      onclick={async () =>
        train && (await createDefaultTrainFunction(train.uuid))}
    >
      <Plus />Add Function
    </Button>
  </div>

  <!-- Function Editor -->
  {#if train}
    <FunctionViewer trainId={train.uuid} bind:selFunction />
  {/if}

  <Separator />
</div>
