<script lang="ts">
  import type { ClientTrain } from "$lib/client/Trains/Train.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import ConnectionSelector from "../Connections/ConnectionSelector.svelte";
  import FunctionViewer from "./Functions/FunctionViewer.svelte";

  interface Props {
    train: ClientTrain;
  }

  let { train = $bindable() }: Props = $props();
</script>

<div>
  <!-- Name -->
  <div class="grid grid-cols-4 my-2 items-center gap-4">
    <Label for="trainName" class="text-right">Name</Label>
    <Input id="trainName" bind:value={train.name} class="col-span-3" />
  </div>

  <!-- Address -->
  <div class="grid grid-cols-4 my-2 items-center gap-4">
    <Label for="trainAddress" class="text-right">Address</Label>
    <Input id="trainAddress" bind:value={train.address} class="col-span-3" />
  </div>

  <!-- Connection -->
  <div class="grid grid-cols-4 my-2 items-center gap-4 w-full">
    <Label for="trainConnection" class="text-right">Connection</Label>
    <ConnectionSelector
      layoutId={train.layoutUuid}
      bind:selConnectionId={train.connUuid}
    />
  </div>

  <Separator class="my-4" />

  <FunctionViewer functions={train.functions} trainUuid={train.uuid} />

  <Separator class="my-4" />
</div>
