<script lang="ts">
  import { page } from "$app/state";
  import type { LayoutClient, LayoutUUID } from "$lib/client/LayoutClient.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
    import type { Layout } from "$lib/server/Layout.server.svelte";

  const layout: LayoutClient = $derived(
    page.data.layout as LayoutClient,
  );
</script>

<div class="flex flex-wrap gap-4 p-4">
  <Button>Add</Button>

  {#each layout.sensors.values() as sensor}
    <div class="border-2 border-primary rounded-md p-4">
      <h1 class="text-2xl">{sensor.name}</h1>
      <p class="text-xl">{sensor.comment}</p>
      <p class="text-xl">{sensor.state}</p>
    </div>
  {/each}
</div>
