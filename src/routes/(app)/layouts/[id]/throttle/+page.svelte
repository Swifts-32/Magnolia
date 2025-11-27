<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import Throttle from "$lib/components/Throttle/throttle.svelte";
  import Fab from "$lib/components/FAB/Fab.svelte";
  import { Plus } from "lucide-svelte";
  import type { PageProps } from "../$types";
  import { SvelteMap } from "svelte/reactivity";

  let { data }: PageProps = $props();

  interface Throttle {
    id: string;
  }

  let throttles: SvelteMap<string, Throttle> = $state(new SvelteMap());

  function deleteThrottle(id: string) {
    throttles.delete(id);
  }

  function createThrottle() {
    const id = crypto.randomUUID();

    throttles.set(id, {
      id,
    });
  }
</script>

<svelte:head>
  <title>Throttle</title>
</svelte:head>

<main class="m-5">
  <!-- Add Throttle -->
  <button onclick={createThrottle}>
    <Fab disabled={throttles.size >= 10} label="Add Throttle">
      <Plus class="size-8" />
    </Fab>
  </button>

  <div class="flex flex-row flex-wrap justify-center gap-4">
    {#each throttles as [id]}
      <Throttle layoutId={data.id} throttleId={id} {deleteThrottle} />
    {/each}
  </div>
</main>
