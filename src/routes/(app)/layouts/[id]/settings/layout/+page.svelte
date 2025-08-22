<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { beforeNavigate, goto } from "$app/navigation";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { onDestroy, onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { Trash2 } from "lucide-svelte";
  import { getLayoutClientState } from "$lib/client/LayoutClient.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { deleteLayout } from "../../../layouts.remote";

  // const layout = getLayoutClientState();
  let layoutName: string = $state("");
  let isDialogOpen = $state(false);

//   onMount(() => {
//     layoutName = layout.name;

//     beforeNavigate(({ cancel }) => {
//       if (!layoutName?.trim()) {
//         toast.error("Layout name is required");
//         cancel(); // This cancels the navigation.
//       }
//     });
//   });

//   // Save the layout
//   onDestroy(() => {
//     const layoutData = {
//       layoutName: layoutName,
//     };

//     // Don't update the layout if nothing has changed
//     if (layoutName === layout.name) return;

//     fetch(`/api/layout/${layout.uuid}/edit`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(layoutData),
//     })
//       .then((response) => {
//         if (response.ok) {
//           toast.success("Layout updated successfully");
//         } else {
//           toast.error("Failed to update layout");
//         }
//       })
//       .catch((error) => {
//         toast.error(`Error updating layout: ${error}`);
//       });
//   });
</script>

<div class="m-4">
  <h1 class="text-4xl my-10">Layout</h1>

  <!-- Layout Name -->
  <div class="grid grid-cols-4 items-center gap-4 my-4">
    <Label for="layoutName" class="text-right">Name</Label>
    <Input id="layoutName" bind:value={layoutName} class="col-span-3" />
  </div>

  <!-- Delete Layout Dialog -->
  <Dialog.Root bind:open={isDialogOpen}>
    <Dialog.Trigger>
      <Button variant="destructive" class="w-96"
        ><Trash2 /> Delete Layout</Button
      >
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Delete Layout</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete this layout?
        </Dialog.Description>
      </Dialog.Header>

      <!-- <form {...deleteLayout.for(layout.uuid)}>
        <Dialog.Footer>
          <Button
            type="reset"
            onclick={() => (isDialogOpen = false)}
            variant="outline"
            class="w-32">Cancel</Button
          >
          <Button type="submit" variant="destructive" class="w-32"
            >Delete Layout</Button
          >
        </Dialog.Footer>
      </form> -->
    </Dialog.Content>
  </Dialog.Root>
</div>
