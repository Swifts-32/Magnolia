<script lang="ts">
  import { page } from "$app/state";
  import type { LayoutClient } from "$lib/client/LayoutClient.svelte";
  import AddSensorDialog from "$lib/components/Settings/Sensor/AddSensorDialog.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  const layout: LayoutClient = $derived(page.data.layout as LayoutClient);
  let isAddSensorDialogOpen: boolean = $state(false);
</script>

<AddSensorDialog bind:open={isAddSensorDialogOpen} layoutUuid={layout.uuid} />

<div class="flex flex-wrap gap-4 p-4">
  <Button onclick={() => (isAddSensorDialogOpen = true)}>Add</Button>

  {#each layout.sensors.values() as sensor}
    <div class="border-2 border-primary rounded-md p-4">
      <h1 class="text-2xl">{sensor.name}</h1>
      <p class="text-xl">{sensor.comment}</p>
      <p class="text-xl">{sensor.state}</p>
    </div>
  {/each}
</div>
