<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { layoutClientHandler } from "../../../../../../services/Layouts/LayoutClientHandler.svelte";
  import { beforeNavigate, goto } from "$app/navigation";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { onDestroy, onMount } from "svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import { toast } from "svelte-sonner";
  import ConformationDialog from "$lib/components/Settings/Common/ConformationDialog/ConformationDialog.svelte";
  import { Trash2 } from "lucide-svelte";
  import type {
    LayoutClient,
    LayoutUUID,
  } from "$lib/client/LayoutClient.svelte";
  import { page } from "$app/state";

  const layout: LayoutClient | undefined = $derived(
    layoutClientHandler.layouts.get(page.params.id as LayoutUUID),
  );
  let layoutName: string = $state("");

  onMount(() => {
    layoutName = layout?.name ?? "";

    beforeNavigate(({ cancel }) => {
      if (!layoutName?.trim()) {
        toast.error("Layout name is required");
        cancel(); // This cancels the navigation.
      }
    });
  });

  onDestroy(() => {
    // Save layout
    if (!layout) return;

    const layoutData = {
      layoutName: layoutName,
    };

    // Don't update the layout if nothing has changed
    if (layoutName === layout.name) return;

    fetch(`/api/layout/${layout.uuid}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(layoutData),
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Layout updated successfully");
        } else {
          toast.error("Failed to update layout");
        }
      })
      .catch((error) => {
        toast.error(`Error updating layout: ${error}`);
      });
  });

  function deleteLayout() {
    if (!layout) return;

    fetch(`/api/layout/${layout.uuid}/delete`);
    goto("/");
  }
</script>

<div class="m-4">
  <h1 class="text-4xl my-10">Layout</h1>

  <!-- Layout Name -->
  <div class="grid grid-cols-4 items-center gap-4 my-4">
    <Label for="layoutName" class="text-right">Name</Label>
    <Input id="layoutName" bind:value={layoutName} class="col-span-3" />
  </div>

  <!-- Delete Layout -->
  <ConformationDialog title="Delete Layout">
    {#snippet trigger()}
      <Button variant="destructive" class="w-96"
        ><Trash2 /> Delete Layout</Button
      >
    {/snippet}
    {#snippet primaryButton()}
      <Button variant="destructive" class="w-28" onclick={deleteLayout}
        >Delete Train</Button
      >
    {/snippet}
    {#snippet secondaryButton()}
      <Button variant="outline" class="w-28">Cancel</Button>
    {/snippet}
    <p>Are you sure you want to delete this layout?</p>
  </ConformationDialog>
</div>

<Toaster />
