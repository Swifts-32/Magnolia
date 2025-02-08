<script lang="ts">
  import { ChevronDown, ChevronUp } from "lucide-svelte";
  import { TrainDirection } from "$lib/client/Trains/Train.svelte";
  import { cn } from "$lib/utils";

  interface Props {
    direction?: TrainDirection;
    disabled?: boolean;
    onchanged?: (value: TrainDirection) => void;
    class?: string;
  }

  let {
    direction = $bindable(TrainDirection.Forward),
    onchanged,
    disabled = false,
    class: className,
    ...restProps
  }: Props = $props();

  function selectDir(newDir: TrainDirection) {
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
    className
  )}
  {...restProps}
>
  <!-- Forward -->
  <button
    {disabled}
    type="button"
    onclick={() => selectDir(TrainDirection.Forward)}
    class="w-10 grow rounded-sm flex justify-center items-center

            {direction == TrainDirection.Forward
      ? 'text-white bg-secondary cursor-default disabled:bg-secondary-disabled'
      : 'text-black bg-primary cursor-pointer disabled:cursor-default disabled:bg-primary-disabled'}          "
  >
    <ChevronUp size="35px" />
  </button>

  <!-- Reverse -->
  <button
    {disabled}
    type="button"
    onclick={() => selectDir(TrainDirection.Reverse)}
    class="w-10 grow rounded-sm flex justify-center items-center

            {direction == TrainDirection.Reverse
      ? 'text-white bg-secondary cursor-default disabled:bg-secondary-disabled'
      : 'text-black bg-primary cursor-pointer disabled:cursor-default disabled:bg-primary-disabled'}          "
  >
    <ChevronDown size="35px" />
  </button>
</div>
