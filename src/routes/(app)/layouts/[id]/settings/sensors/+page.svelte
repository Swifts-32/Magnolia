<script lang="ts">
  import { Button } from "#lib/components/ui/button/index.js";
  import type { LayoutProps } from "../$types";

  let { data }: LayoutProps = $props();

  let isAddSensorDialogOpen: boolean = $state(false);
</script>

<!-- <AddSensorDialog bind:open={isAddSensorDialogOpen} layoutUuid={layout.uuid} /> -->

<div class="flex flex-wrap gap-4 p-4">
  <Button onclick={() => (isAddSensorDialogOpen = true)}>Add</Button>

  <!-- {#each layout.sensors.values() as sensor}
    <div class="border-2 border-primary rounded-md p-4">
      <h1 class="text-2xl">{sensor.name}</h1>
      <p class="text-xl">{sensor.comment}</p>
      <p class="text-xl">{sensor.state}</p>
    </div>
  {/each} -->
</div>
