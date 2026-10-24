<script lang="ts">
  import { gStore } from "./cellStore.svelte";
  import { CellTypes, EditMode } from "./canvasTypes.svelte";
  import { type Snippet } from "svelte";
  import { twMerge } from "tailwind-merge";
  import Toggle from "../ui/toggle/toggle.svelte";
  import Button from "../ui/button/button.svelte";

  interface Props {
    name?: string;
    size?: "icon" | "default";
    cellType: CellTypes;
    children?: Snippet;
    class?: string;
  }

  let {
    name,
    cellType,
    size = "default",
    class: className,
    children,
    ...restProps
  }: Props = $props();

  let selected = $derived(gStore.curTool == cellType);

  function handleToggle() {
    if (selected) {
      gStore.setTool(null);
    } else {
      gStore.setTool(cellType);
    }
  }
</script>

{#if size == "default"}
  <Button
    size="sm"
    onclick={handleToggle}
    class={twMerge(
      "w-28 justify-start p-1 flex gap-0 select-none",
      selected
        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
        : "bg-primary text-primary-foreground bg-primary/90",
      className,
    )}
    {...restProps}
  >
    {@render children?.()}
    {name}
  </Button>
{:else if size == "icon"}
  <Toggle size="sm" onclick={handleToggle} class={className} {...restProps}>
    {@render children?.()}
  </Toggle>
{/if}
