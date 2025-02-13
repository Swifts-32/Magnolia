<script lang="ts">
    import { goto } from "$app/navigation";
    import { layoutClientHandler } from "../../services/Layouts/LayoutClientHandler.svelte";
    import LayoutAdd from "$lib/components/Settings/Layouts/LayoutAdd.svelte";
</script>

<div class="mx-10 flex flex-col justify-center">
    <h1 class="text-center text-8xl mx-10 my-5">Your are Home</h1>
    <hr class="my-10" />

    
    <div class="flex flex-wrap">
        {#each layoutClientHandler.layouts.values() as layout (layout.uuid)}
            <button
                class="border-primary border-2 p-2 rounded-md size-52 m-5 select-none"
                onclick={() => goto(`/layouts/${layout.uuid}`)}
            >
                <p class="text-3xl text-center">{layout.name}</p>
            </button>
        {/each}
        <LayoutAdd/>
    </div>
</div>
