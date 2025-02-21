<script lang="ts">
    import type { TrainClientFunction } from "$lib/client/Trains/Functions/Function.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Toggle from "$lib/components/ui/toggle/toggle.svelte";
    import type { TrainFunctionUUID } from "$lib/types/Trains/Functions/Functions";
    import { Bell, Lightbulb, Sun, Volume2 } from "lucide-svelte";

    interface Props {
        disabled?: boolean;
        trainFunction: TrainClientFunction;
        onclick?: (uuid: TrainFunctionUUID, state: boolean) => void;
        [key: string]: any;
    }

    let {
        trainFunction,
        selected = $bindable(false),
        onclick,
        disabled,
        ...props
    }: Props = $props();
</script>

{#snippet functionText()}
    <p class="text-[0.7rem] leading-[7px]">
        {trainFunction.name}
    </p>
{/snippet}

{#snippet body()}
    {#if trainFunction.icon == "Light1"}
        <Lightbulb />
        {@render functionText()}
    {:else if trainFunction.icon == "Light2"}
        <Sun />
        {@render functionText()}
    {:else if trainFunction.icon == "Speaker"}
        <Volume2 />
        {@render functionText()}
    {:else if trainFunction.icon == "Bell"}
        <Bell />
        {@render functionText()}
    {:else if trainFunction.icon == "Text"}
        <p class="text-lg">
            {trainFunction.name}
        </p>
    {/if}
{/snippet}

{#if trainFunction.mode == "toggle"}
    <Toggle
        {disabled}
        size="icon"
        class="size-14 p-2 flex flex-col gap-1"
        bind:pressed={selected}
        onclick={() => onclick?.(trainFunction.uuid, !selected)}
        {...props}
    >
        {@render body()}
    </Toggle>
{:else if trainFunction.mode == "select"}
    <Button
        {disabled}
        size="icon"
        class="size-14 p-2 flex flex-col gap-1 bg-primary active:bg-secondary active:text-secondary-foreground text-primary-foreground"
        variant="default"
        onmousedown={() => {
            selected = true;
            onclick?.(trainFunction.uuid, selected);
        }}
        onmouseup={() => {
            selected = false;
            onclick?.(trainFunction.uuid, selected);
        }}
        {...props}
    >
        {@render body()}
    </Button>
{/if}
