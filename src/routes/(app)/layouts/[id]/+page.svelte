<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import Canvas from "$lib/components/canvas/Canvas.svelte";
    import { Modes } from "$lib/components/canvas/canvasTypes.svelte";
    import PanelSelector from "$lib/components/canvas/panelSelector.svelte";
    import Throttle from "$lib/components/Throttle/throttle.svelte";
</script>

<div class="flex p-4 max-w-full max-h-100">
    <Throttle layoutId={page.params.id} throttleId={crypto.randomUUID()} />

    <!-- <div class="flex flex-col mx-10 my-8">
        <PanelSelector>
        </PanelSelector>

        <div
            class="grow relative overflow-scroll mt-2 rounded-md overflow-x-hidden overflow-y-hidden"
        >
            <Canvas />
        </div>
    </div> -->
</div>
