<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import type { Train } from "../../../../services/train.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { tick } from "svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import {
    type Connections,
    type ConnectionUUID,
    LayoutClient,
    type LayoutUUID,
  } from "$lib/LayoutClient.svelte";
  import { layoutClientHandler } from "../../../../services/Layouts/LayoutClientHandler";

  interface Props {
    train: Train;
    layoutUUID: LayoutUUID;
  }

  let { train, layoutUUID }: Props = $props();

  let editMode: boolean = $state(false);

  const layout: LayoutClient | undefined = $derived.by(() => {
    return layoutClientHandler.getLayout(layoutUUID);
  });

  let selectedConnectionUUID: ConnectionUUID = $state(train.connectionUUID);
  const selectedConnection: Connections | undefined = $derived.by(() => {
    if (layout) {
      return layout.connections.get(selectedConnectionUUID);
    }
  });

  function saveChanges() {
    fetch(`/api/layout/${layoutUUID}/${selectedConnectionUUID}/trains/add`);
    editMode = false;
  }
</script>



<button
  class="border-primary border-2 p-3 rounded-md w-60 h-fit select-none"
  onclick={() => (editMode = true)}
>
  <p class="text-2xl text-start">{train.name}</p>
  <div class="flex gap-3">
    <p class="text-sm text-gray-400">Addr: {train.addr}</p>
    <p class="text-sm text-gray-400">Connection: {selectedConnection?.connName}</p>
  </div>
</button>

<Dialog.Root open={editMode}>
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
        <Input id="trainName" value={train.name} class="col-span-3" />
      </div>

      <!-- Address -->
      <div class="grid grid-cols-4 my-2 items-center gap-4">
        <Label for="trainAddress" class="text-right">Address</Label>
        <Input id="trainAddress" value={train.addr} class="col-span-3" />
      </div>

      <!-- Connection -->
      <div class="grid grid-cols-4 my-2 items-center gap-4">
        <Label for="trainConnection" class="text-right">Connection</Label>
        <Select.Root type="single" name="trainConnection" bind:value={selectedConnectionUUID}>
          <Select.Trigger class="w-56">
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
