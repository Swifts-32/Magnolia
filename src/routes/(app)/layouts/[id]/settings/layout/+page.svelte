<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { Trash2 } from "lucide-svelte";
  import { deleteLayout } from "../../../layouts.remote";
  import type { PageProps } from "./$types";
  import { goto } from "$app/navigation";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";

  let { data }: PageProps = $props();

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
    <Input id="layoutName" value={data.name} class="col-span-3" />
  </div>

  <!-- Delete Layout Dialog -->
  <AlertDialog.Root>
    <AlertDialog.Trigger>
      <Button class="w-64" variant="destructive">
        <Trash2 />Delete Layout
      </Button>
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
        <AlertDialog.Description>
          This action cannot be undone. Are you sure you want to delete this
          layout?
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action
          onclick={async () => {
            await deleteLayout(data.id);
            goto("/");
          }}>Delete Layout</AlertDialog.Action
        >
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
</div>
