<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import type { LayoutData } from "../../$types";
  import { layoutClientHandler } from "../../../../../../services/Layouts/LayoutClientHandler.svelte";
  import { beforeNavigate, goto } from "$app/navigation";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { onDestroy, onMount } from "svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import { toast } from "svelte-sonner";
  import { navigating } from "$app/state";

  let { data }: { data: LayoutData } = $props();
  let layoutName: string | undefined = $state(data.layout.name);

  onMount(() => {
    beforeNavigate(({ cancel }) => {
      if (!layoutName?.trim()) {
        toast.error("Layout name is required");
        cancel(); // This cancels the navigation.
      }
    });
  });

  onDestroy(() => {
    // Save layout
    const layoutData = {
      layoutName: layoutName,
    };

    fetch(`/api/layout/${data.layout.uuid}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(layoutData),
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Layout updated successfully");
          layoutClientHandler.refreshLayouts();
        } else {
          toast.error("Failed to update layout");
        }
      })
      .catch((error) => {
        toast.error(`Error updating layout: ${error}`);
      });
  });
</script>

<div class="m-4">
  <h1 class="text-4xl my-10">Layout</h1>

  <!-- Layout Name -->
  <div class="grid grid-cols-4 items-center gap-4 my-4">
    <Label for="layoutName" class="text-right">Name</Label>
    <Input id="layoutName" bind:value={layoutName} class="col-span-3" />
  </div>

  <!-- Delete Layout -->
  <Button
    class="w-96"
    variant="destructive"
    onclick={() => {
      fetch(`/api/layout/${data.layout.uuid}/delete`);
      layoutClientHandler.refreshLayouts();
      goto("/");
    }}
  >
    <p>Delete Layout</p>
  </Button>
</div>

<Toaster />
