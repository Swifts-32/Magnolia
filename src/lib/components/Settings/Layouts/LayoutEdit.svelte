<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import type { Train } from "../../../../services/train.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { tick } from "svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as Accordion from "$lib/components/ui/accordion/index.js";

  import {
    type Connections,
    type ConnectionUUID,
    LayoutClient,
    type LayoutUUID,
  } from "$lib/LayoutClient.svelte";
  import { layoutClientHandler } from "../../../../services/Layouts/LayoutClientHandler";
  import { Plus } from "lucide-svelte";

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
  class="border-primary border-2 p-3 rounded-md w-60 h-fit select-none"
  onclick={() => (editMode = true)}
>
  <p class="text-2xl text-start">{layout.name}</p>
  <div class="flex gap-3">
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
              <button
                class="border-primary border-2 px-3 flex rounded-md gap-3 w-full my-2 h-14 items-center select-none"
                onclick={() => (editMode = true)}
              >
                <p class="text-xl">{connection.connName}</p>
                <div class="flex-col flex">
                  <p class="text-sm text-start text-gray-400">
                    Protocol: e.g. DCC Ex, LCC, etc.
                  </p>
                  <!-- TODO:Add the connection type e.g. Serial, Bluetooth, etc. -->
                  <p class="text-sm text-start text-gray-400">
                    Type: e.g. Serial, Bluetooth, etc.
                  </p>
                </div>
              </button>
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

      <!-- Connection -->
      <!-- <div class="grid grid-cols-4 my-2 items-center gap-4">
        <Label for="layoutConnection" class="text-right">Connection</Label>
        <Select.Root type="single" name="layoutConnection">
          <Select.Trigger class="w-56">

            "asd"
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
      </div> -->
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
