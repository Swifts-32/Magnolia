<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Accordion from "$lib/components/ui/accordion/index.js";
  import { Plus } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import ConnectionAdd from "./ConnectionAdd.svelte";
  import { layoutClientHandler } from "../../../../services/Layouts/LayoutClientHandler.svelte";

  let editMode: boolean = $state(false);

  let layoutName: string | undefined = $state();

  function saveChanges() {
    const data: any = {
      layoutName: layoutName,
    };

    fetch(`/api/layout/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          editMode = false; // Close the dialog on success
          toast.success("Layout created successfully");


          // Refresh the layout list
          layoutClientHandler.refreshLayouts();
        } else {
          console.error("Failed to create layout");
          toast.error("Failed to create layout");
        }
      })

      .catch((error) => {
        console.error("Error creating layout:", error);
        toast.error("Error creating layout");
      });

  }
</script>

<button
  class="border-primary border-2 p-2 m-5 rounded-md size-52 select-none flex justify-center place-items-center"
  onclick={() => {
    editMode = true;
  }}
>
  <Plus size={40} />
  <p class="text-xl">Add new layout</p>
</button>

<Dialog.Root open={editMode}>
  <Dialog.Content
    interactOutsideBehavior="ignore"
    escapeKeydownBehavior="ignore"
  >
    <Dialog.Header>
      <Dialog.Title>Add New Layout</Dialog.Title>
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
            <!-- {#each layout.connections as [key, connection]}
              <ConnectionEdit {connection} />
            {/each}
            <button
              class="border-primary border-2 flex p-3 rounded-md gap- w-full my-1 h-14 justify-center items-center select-none"
            >
              <Plus size={30} />
              <p class="text-xl">Add Connection</p>
            </button> -->
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
