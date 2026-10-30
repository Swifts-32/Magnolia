<script lang="ts">
  import { page } from "$app/state";
  import Canvas from "#lib/components/canvas/Canvas.svelte";
  import Throttle from "#lib/components/Throttle/throttle.svelte";
</script>

<div class="flex p-4 gap-4 justify-center flex-wrap">
  {#if page.params.id}
    <Throttle layoutId={page.params.id} throttleId={crypto.randomUUID()} />
  {/if}

  <div class="h-100 w-200 bg-amber-100 rounded-md flex flex-col">
    <Canvas />
  </div>
</div>
