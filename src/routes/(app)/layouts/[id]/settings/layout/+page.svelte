<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { onDestroy, onMount } from "svelte";
  import { Trash2 } from "lucide-svelte";
  import { deleteLayout } from "../../../layouts.remote";
  import ConformationDialog from "$lib/components/Settings/Common/ConformationDialog/ConformationDialog.svelte";
  import type { PageProps } from "./$types";
    import { goto } from "$app/navigation";

  let { data }: PageProps = $props();
  // const layout = getLayoutClientState();
  let layoutName: string = $state("");

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
  <ConformationDialog title="Delete Layout">
    {#snippet trigger()}
      <Button class="w-64" variant="destructive">
        <Trash2 />Delete Layout
      </Button>
    {/snippet}
    {#snippet primaryButton()}
      <Button
        variant="destructive"
        class="w-32"
        onclick={async () => {
          await deleteLayout(data.id);
          goto("/");
        }}
      >
        Delete Layout</Button
      >
    {/snippet}
    {#snippet secondaryButton()}
      <Button variant="outline" class="w-32">Cancel</Button>
    {/snippet}
    <p>Are you sure you want to delete this layout?</p>
  </ConformationDialog>
</div>
