<script lang="ts">
  import Throttle from "$lib/components/Throttle/throttle.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let noOfThrottles: number = $state(1);
</script>

<main class="m-5">
  <Button disabled={noOfThrottles >= 10} onclick={() => (noOfThrottles += 1)}
    >Add Throttle</Button
  >
  <Button
    disabled={noOfThrottles === 0}
    onclick={() => noOfThrottles > 0 && (noOfThrottles -= 1)}
    >Delete Throttle</Button
  >

  <div class="flex flex-row flex-wrap justify-center gap-4">
    {#each Array(noOfThrottles) as _}
      <Throttle layoutId={data.layoutId} />
    {/each}
  </div>
</main>
