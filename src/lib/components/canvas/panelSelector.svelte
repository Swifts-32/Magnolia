<script lang="ts">
  import { Eye, Pencil } from "@lucide/svelte";
  import { cn } from "#lib/utils.js";
  import { EditMode, Modes, OperateMode } from "./canvasTypes.svelte";
  import type { Snippet } from "svelte";
  import { gStore } from "./cellStore.svelte";
  import { IsMobile } from "#lib/hooks/is-mobile.svelte.ts";

  interface Props {
    mode?: Modes;
    disabled?: boolean;
    onchanged?: (value: Modes) => void;
    class?: string;
    children?: Snippet;
  }

  let {
    mode = $bindable(
      gStore.mode instanceof EditMode ? Modes.Edit : Modes.Operate,
    ),
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
      "h-fit gap-1 flex",
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
        class="w-10 grow flex justify-center items-center gap-2 p-2
            {m.mode == mode
          ? 'text-white bg-secondary cursor-default disabled:bg-secondary-disabled'
          : 'text-black bg-primary cursor-pointer disabled:cursor-default disabled:bg-primary-disabled'}          "
      >
        <m.icon size="20px" />
        {m.name}
      </button>
    {/each}
  </div>

  {@render children?.()}
</div>
