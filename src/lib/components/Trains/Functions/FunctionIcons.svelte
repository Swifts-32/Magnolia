<script lang="ts">
  import type { TrainFunctionIcons } from "$lib/types/TrainFunctions";
  import { Bell, Lightbulb, Sun, Text, Volume2 } from "@lucide/svelte";

  interface Props {
    size: number;
    selectedIcon: TrainFunctionIcons;
    orientation?: "horizontal" | "vertical";
    text?: boolean;
  }

  let {
    size,
    selectedIcon,
    orientation = "horizontal",
    text = true,
  }: Props = $props();
</script>

<div
  class="{orientation === 'horizontal'
    ? 'flex-row gap-1'
    : 'flex-col '} flex items-center"
>
  {#if selectedIcon === "Bell"}
    <Bell {size} />
  {:else if selectedIcon === "Speaker"}
    <Volume2 {size} />
  {:else if selectedIcon === "Light1"}
    <Lightbulb {size} />
  {:else if selectedIcon === "Light2"}
    <Sun {size} />
  {:else if selectedIcon === "Text"}
    <Text {size} />
  {/if}

  {#if text}
    <p class="text-md">{selectedIcon}</p>
  {/if}
</div>
