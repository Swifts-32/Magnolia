<script lang="ts">
    import { Eye, Pencil } from "lucide-svelte";
    import { cn } from "$lib/utils";
    import { EditMode, Modes, OperateMode } from "./canvasTypes.svelte";
    import type { Snippet } from "svelte";
    import { gStore } from "./cellStore.svelte";

    interface Props {
        mode?: Modes;
        disabled?: boolean;
        onchanged?: (value: Modes) => void;
        class?: string;
        children?: Snippet;
    }

    let {
        mode = $bindable(gStore.mode instanceof EditMode ? Modes.Edit : Modes.Operate),
        onchanged,
        disabled,
        class: className,
        children,
        ...restProps
    }: Props = $props();

    const modes: {
        mode: Modes;
        icon: any;
        name: string;
    }[] = [
        {
            mode: Modes.Operate,
            icon: Eye,
            name: "Operate",
        },
        {
            mode: Modes.Edit,
            icon: Pencil,
            name: "Edit",
        },
    ];

    function selectMode(m: Modes) {
        if (mode != m) {
            gStore.mode = m;
            mode = m;
            onchanged?.(mode);
        }
    }
</script>

<div>
    <div
        class={cn(
            "h-fit gap-1 flex rounded-t-md border-8 border-primary border-b-0",
            disabled ? "bg-primary-disabled" : "bg-primary",
            className,
        )}
        {...restProps}
    >
        {#each modes as m (m.mode)}
            <button
                {disabled}
                type="button"
                onclick={() => selectMode(m.mode)}
                class="w-10 grow rounded-t-sm flex justify-center items-center gap-2 p-2
            {m.mode == mode
                    ? 'text-white bg-secondary cursor-default disabled:bg-secondary-disabled'
                    : 'text-black bg-primary cursor-pointer disabled:cursor-default disabled:bg-primary-disabled'}          "
            >
                <m.icon size="20px" />
                {m.name}
            </button>
        {/each}
    </div>

    <div class="w-full bg-primary h-40 p-2 pt-0 rounded-b-md">
        <div class="flex size-full bg-secondary rounded-sm p-4 items-center">
            {@render children?.()}
        </div>
    </div>
</div>
