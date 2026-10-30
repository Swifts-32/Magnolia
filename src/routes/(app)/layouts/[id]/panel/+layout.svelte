<script lang="ts">
  import { goto } from "$app/navigation";
  import Canvas from "#lib/components/canvas/Canvas.svelte";
  import { Modes } from "#lib/components/canvas/canvasTypes.svelte.js";
  import PanelSelector from "#lib/components/canvas/panelSelector.svelte";
  import { IsMobile } from "#lib/hooks/is-mobile.svelte.ts";

  let { children } = $props();

  const isMobile = new IsMobile();
</script>

<div class="max-h-svh w-full flex flex-col overflow-hidden">
  {#if isMobile.current}
    <div class="w-full h-40 flex bg-secondary p-4 items-center shrink-0">
      {@render children()}
    </div>
  {:else}
    <PanelSelector
      onchanged={(mode) => goto(`${mode == Modes.Edit ? "edit" : "operate"}`)}
    >
      <div class="w-full h-40 flex bg-secondary p-4 items-center shrink-0">
        {@render children()}
      </div>
    </PanelSelector>
  {/if}

  <div class="grow relative min-h-0 overflow-hidden">
    <Canvas />
  </div>
</div>
