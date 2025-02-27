<script lang="ts">
    import type { TrainFunctionIcons } from "$lib/types/Trains/Functions/Functions";
    import { Bell, Lightbulb, Sun, Text, Volume2 } from "lucide-svelte";

    interface Props {
        size: number;
        selectedIcon: TrainFunctionIcons;
        text?: boolean;
    }

    let { size, selectedIcon, text = true }: Props = $props();
</script>

<div class="flex items-center">
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
        <p class="text-md ml-2">{selectedIcon}</p>
    {/if}
</div>
