<script lang="ts">
    import { ChevronDown, ChevronUp } from "lucide-svelte";
    import { Direction } from "../../../../routes/(app)/layouts/[id]/throttle/throttle";
    import { cn } from "$lib/utils";

    interface Props {
        direction?: Direction | undefined;
        disabled?: boolean;
        onchanged?: (value: Direction) => void;
        class?: string;
    }

    let {
        direction = $bindable(undefined),
        onchanged,
        disabled = false,
        class: className,
        ...restProps
    }: Props = $props();

    function selectDir(newDir: Direction) {
        if (direction != newDir) {
            direction = newDir;
            onchanged?.(direction);
        }
    }
</script>

<div
    class={cn(
        "p-[6px] rounded-md flex h-full flex-col gap-1 max-w-min",
        disabled ? "bg-primary-disabled" : "bg-primary",
        className,
    )}
    {...restProps}
>
    <!-- Forward -->
    <button
        {disabled}
        type="button"
        onclick={() => selectDir(Direction.forward)}
        class="w-10 grow rounded-sm flex justify-center items-center
            {direction == Direction.forward
            ? 'text-white bg-secondary cursor-default disabled:bg-secondary-disabled'
            : 'text-black bg-primary cursor-pointer disabled:cursor-default disabled:bg-primary-disabled'}          "
    >
        <ChevronUp size="35px" />
    </button>

    <!-- Reverse -->
    <button
        {disabled}
        type="button"
        onclick={() => selectDir(Direction.reverse)}
        class="w-10 grow rounded-sm flex justify-center items-center
            {direction == Direction.reverse
            ? 'text-white bg-secondary cursor-default disabled:bg-secondary-disabled'
            : 'text-black bg-primary cursor-pointer disabled:cursor-default disabled:bg-primary-disabled'}          "
    >
        <ChevronDown size="35px" />
    </button>
</div>
