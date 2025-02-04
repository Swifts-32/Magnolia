<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Toggle from "$lib/components/ui/toggle/toggle.svelte";
    import {
        FunctionIcons,
        type FunctionModes,
    } from "../../../../services/train.svelte";
    import { Bell, Lightbulb, Sun, Volume2 } from "lucide-svelte";

    interface Props {
        disabled?: boolean;
        name: string;
        id: number;
        icon: FunctionIcons;
        mode: FunctionModes;
        selected: boolean;
        onclick?: (id: number, state: boolean) => void;
        [key: string]: any;
    }

    let {
        name,
        id,
        icon,
        mode,
        selected = $bindable(false),
        onclick,
        disabled,
        ...props
    }: Props = $props();
</script>

{#snippet functionText()}
    <p class="text-[0.7rem] leading-[7px]">
        F{id}
    </p>
{/snippet}

{#snippet body()}
    {#if icon == FunctionIcons.Light1}
        <Lightbulb />
        {@render functionText()}
    {:else if icon == FunctionIcons.Light2}
        <Sun />
        {@render functionText()}
    {:else if icon == FunctionIcons.Speaker}
        <Volume2 />
        {@render functionText()}
    {:else if icon == FunctionIcons.Bell}
        <Bell />
        {@render functionText()}
    {:else if icon == FunctionIcons.text}
        <p class="text-lg">
            F{id}
        </p>
    {/if}
{/snippet}

{#if mode == "toggle"}
    <Toggle
        {disabled}
        size="icon"
        class="size-14 p-2 flex flex-col gap-1"
        bind:pressed={selected}
        onclick={() => onclick?.(id, !selected)}
        {...props}
    >
        {@render body()}
    </Toggle>
{:else if mode == "select"}
    <Button
        {disabled}
        size="icon"
        class="size-14 p-2 flex flex-col gap-1 bg-primary active:bg-secondary active:text-secondary-foreground text-primary-foreground"
        variant="default"
        onmousedown={() => {
            selected = true;
            onclick?.(id, selected);
        }}
        onmouseup={() => {
            selected = false;
            onclick?.(id, selected);
        }}
        {...props}
    >
        {@render body()}
    </Button>
{/if}
