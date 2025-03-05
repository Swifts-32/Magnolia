<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Plus } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import { layoutClientHandler } from "../../../../services/Layouts/LayoutClientHandler.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import {  fly } from "svelte/transition";
  import {
    backOut,
    circOut,
    cubicOut,
    elasticIn,
    elasticOut,
    expoOut,
    sineOut,
  } from "svelte/easing";
  import { Tween } from "svelte/motion";

  let editMode: boolean = $state(false);
  let page: number = $state(0);

  let layoutName: string | undefined = $state();

  function saveChanges() {
    if (!layoutName) {
      toast.error("Layout name is required");
      return;
    }

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

          // Clear the dialog data
          layoutName = undefined;
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

  let progress = new Tween(0, {
    duration: 400,
    easing: cubicOut,
  });

  function flyIn(node, { duration }) {
    return {
      duration,
      css: (t, u) => {
        const eased = circOut(t);
        return `
					transform: scale(${eased});
          opacity: ${eased};
        `;
      },
    };
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

{#if editMode}
  <div
    transition:flyIn={{ duration: 300 }}
    class="p-4 fixed inset-0 z-10 bg-background flex-col place-items-center content-center gap-20"
  >
    {#key page}
      {#if page === 0}
        <!-- Page 0 content: flies out left and new content will fly in from right -->
        <div
          in:fly={{ x: 1000, duration: 600 }}
          out:fly={{ x: -1000, duration: 600 }}
          class="flex flex-col place-items-center content-center"
        >
          <h1 class="text-4xl mb-5">Add New Layout</h1>
          <h1 class="text-2xl mb-10">What do you want to call this layout?</h1>

          <!-- Name -->
          <div class="grid grid-cols-4 mt-2 mb-4 items-center gap-4">
            <Label for="layoutName" class="text-right">Name</Label>
            <Input id="layoutName" bind:value={layoutName} class="col-span-3" />
          </div>
          <div class="flex gap-4 mt-10">
            <Button
              class="w-32"
              variant="outline"
              onclick={() => (editMode = false)}>Cancel</Button
            >
            <Button class="w-32" onclick={() => (page = 1)}>Next</Button>
          </div>
        </div>
      {:else if page === 1}
        <!-- Page 1 content: flies in from right and exits to left if you go back -->
        <div
          in:fly={{ x: 1000, duration: 600 }}
          out:fly={{ x: -1000, duration: 600 }}
          class="flex flex-col place-items-center content-center"
        >
          <h1 class="text-4xl mb-5">Add New Layout</h1>
          <h1 class="text-2xl mb-10">Add New Connections</h1>
          <Button class="w-32" onclick={() => (page = 0)}>Save</Button>
        </div>
      {/if}
    {/key}
  </div>
  <Toaster />
{/if}
<!-- 
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
<!-- <div class="grid grid-cols-4 mt-2 mb-4 items-center gap-4">
            <Label for="layoutName" class="text-right">Name</Label>
            <Input id="layoutName" bind:value={layoutName} class="col-span-3" />
          </div>
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
</Dialog.Root> -->
