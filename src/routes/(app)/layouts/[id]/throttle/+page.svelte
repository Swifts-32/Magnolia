<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import Throttle from "$lib/components/Throttle/throttle.svelte";
  import { getLayoutClientState } from "$lib/client/LayoutClient.svelte";
  import Fab from "$lib/components/FAB/Fab.svelte";
  import { Plus } from "lucide-svelte";

  const layout = getLayoutClientState();
  let noOfThrottles: number = $state(1);
</script>

<svelte:head>
  <title>Throttle</title>
</svelte:head>

<main class="m-5">
  <!-- Add Throttle -->
  <Fab
    disabled={noOfThrottles >= 10}
    onclick={() => (noOfThrottles += 1)}
    label="Add Throttle"
  >
    <Plus class="size-8" />
  </Fab>

  
  <Button
    disabled={noOfThrottles === 0}
    onclick={() => noOfThrottles > 0 && (noOfThrottles -= 1)}
    >Delete Throttle</Button
  >

  <div class="flex flex-row flex-wrap justify-center gap-4">
    {#each Array(noOfThrottles) as _}
      <Throttle layoutId={layout.uuid} />
    {/each}
  </div>
</main>
