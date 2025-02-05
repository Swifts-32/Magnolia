<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Accordion from "$lib/components/ui/accordion/index.js";
  import { LayoutClient } from "$lib/LayoutClient.svelte";
  import { Plus } from "lucide-svelte";
  import ConnectionEdit from "./ConnectionEdit.svelte";

  interface Props {
    layout: LayoutClient;
  }

  let { layout }: Props = $props();

  let editMode: boolean = $state(false);

  function saveChanges() {
    fetch(`/api/layout/${layout.name}/trains/add`);
    editMode = false;
  }
</script>

<button
  class="border-primary border-2 p-3 flex gap-3 items-center rounded-md w-72 h-16 select-none"
  onclick={() => (editMode = true)}
>
  <p class="text-2xl text-start">{layout.name}</p>
  <div class="flex flex-col items-start">
    <p class="text-sm text-gray-400">Addr: {layout.name}</p>
    <p class="text-sm text-gray-400">Connection: {layout.name}</p>
  </div>
</button>

<Dialog.Root open={editMode}>
  <Dialog.Content
    interactOutsideBehavior="ignore"
    escapeKeydownBehavior="ignore"
  >
    <Dialog.Header>
      <Dialog.Title>Edit Layout</Dialog.Title>
    </Dialog.Header>

    <div class="w-full">
      <Accordion.Root type="single">
        <Accordion.Item value="general">
          <Accordion.Trigger>General</Accordion.Trigger>
          <!-- Name -->
          <div class="grid grid-cols-4 mt-2 mb-4 items-center gap-4">
            <Label for="layoutName" class="text-right">Name</Label>
            <Input id="layoutName" value={layout.name} class="col-span-3" />
          </div>
        </Accordion.Item>

        <Accordion.Item value="connections">
          <Accordion.Trigger>Connections</Accordion.Trigger>
          <Accordion.Content>
            <!-- Add Buttons to go to dialog to edit each connection -->
            {#each layout.connections as [key, connection]}
              <ConnectionEdit {connection} />
            {/each}
            <button
              class="border-primary border-2 flex p-3 rounded-md gap- w-full my-1 h-14 justify-center items-center select-none"
            >
              <Plus size={30} />
              <p class="text-xl">Add Connection</p>
            </button>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
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
