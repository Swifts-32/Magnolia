<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Accordion from "$lib/components/ui/accordion/index.js";
  import { LayoutClient } from "$lib/client/LayoutClient.svelte";
  import { Plus } from "lucide-svelte";
  import ConnectionEdit from "./ConnectionEdit.svelte";
  import { toast } from "svelte-sonner";
  import ConnectionAdd from "./ConnectionAdd.svelte";

  interface Props {
    layout: LayoutClient;
  }

  let { layout }: Props = $props();

  let editMode: boolean = $state(false);

  let layoutName: string = $state(layout.name);

  function saveChanges() {
    const data: any = {
      layoutName: layoutName,
    };

    fetch(`/api/layout/${layout.uuid}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          editMode = false; // Close the dialog on success
          toast.success("Layout updated successfully");

          // Update the layout
          layout.name = layoutName;
        } else {
          console.error("Failed to update layout");
          toast.error("Failed to update layout");
        }
      })
      .catch((error) => {
        console.error("Error updating layout:", error);
        toast.error("Error updating layout");
      });
  }
</script>

<button
  class="border-primary border-2 p-3 items-center rounded-md w-96 h-16 select-none"
  onclick={() => (editMode = true)}
>
  <p class="text-2xl text-start">{layout.name}</p>
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
            <Input id="layoutName" bind:value={layoutName} class="col-span-3" />
          </div>
        </Accordion.Item>

        <Accordion.Item value="connections">
          <Accordion.Trigger>Connections</Accordion.Trigger>
          <Accordion.Content>
            <!-- Add Buttons to go to dialog to edit each connection -->
            {#each layout.connections as [key, connection]}
              <ConnectionEdit {connection} />
            {/each}
            <ConnectionAdd {layout} />
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
