<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import type { Train } from "../../../../services/train.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import {
    type Connections,
    type ConnectionUUID,
    LayoutClient,
    type LayoutUUID,
  } from "$lib/client/LayoutClient.svelte";
  import { layoutClientHandler } from "../../../../services/Layouts/LayoutClientHandler.svelte";
  import { Plus, TrainFront } from "lucide-svelte";

  interface Props {
    layoutUUID: LayoutUUID;
  }

  let { layoutUUID }: Props = $props();

  let editMode: boolean = $state(false);

  const layout: LayoutClient | undefined = $derived.by(() => {
    return layoutClientHandler.layouts.get(layoutUUID);
  });


  let trainName: string | undefined = $state();
  let trainAddress: string | undefined = $state();
  let selectedConnectionUUID: ConnectionUUID | undefined = $state();
  const selectedConnection: Connections | undefined = $derived.by(() => {
    if (layout && selectedConnectionUUID) {
      return layout.connections.get(selectedConnectionUUID);
    }
  });



  function saveChanges() {
    fetch(`/api/layout/${layoutUUID}/trains/add`);
    editMode = false;
  }

</script>

<button
  class="border-primary border-2 p-3 flex rounded-md w-[500px] gap-3 items-center h-20 select-none"
  onclick={() => (editMode = true)}
>
  <Plus size={40} strokeWidth={1}/>
  <p class="text-2xl text-start">Add Train</p>
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
      <!-- TODO Convert to a dynamic width -->
      <div class="grid grid-cols-4 my-2 items-center gap-4 w-full">
        <Label for="trainConnection" class="text-right">Connection</Label>
        <Select.Root type="single" name="trainConnection" bind:value={selectedConnectionUUID}>
          <Select.Trigger class="w-80">
            {selectedConnection?.connName ?? selectedConnectionUUID}
          </Select.Trigger>
          <Select.Content>
            {#if layout}
              {#each layout.connections as [key, connection]}
                <Select.Item value={key}>
                  {#if connection}
                    <div class="flex flex-col">
                      <p>{connection.connName}</p>
                      <p class="text-sm">UID: {key}</p>
                    </div>
                  {:else}
                    <p class="text-sm">UID: {key}</p>
                  {/if}
                </Select.Item>
              {/each}
            {/if}
          </Select.Content>
        </Select.Root>
      </div>

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
