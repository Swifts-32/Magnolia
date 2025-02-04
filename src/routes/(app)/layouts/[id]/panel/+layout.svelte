<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import Canvas from "$lib/components/canvas/Canvas.svelte";
    import { Modes } from "$lib/components/canvas/canvasTypes.svelte";
    import PanelSelector from "$lib/components/canvas/panelSelector.svelte";

    let { children } = $props();
</script>

<div class="max-h-[85vh] flex flex-col mx-10 my-8">
    <PanelSelector
        onchanged={(mode) =>
            goto(`${mode == Modes.Edit ? "edit" : "operate"}`)}
    >
        {@render children()}
    </PanelSelector>

    <div
        class="grow relative overflow-scroll mt-2 rounded-md overflow-x-hidden overflow-y-hidden"
    >
        <Canvas />
    </div>
</div>
