<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    onclick?: () => void;
    label: string;
    disabled?: boolean;
    children: Snippet;
  }

  let {
    onclick = () => {},
    label,
    children,
    disabled = false,
  }: Props = $props();
</script>

<button
  {onclick}
  {disabled}
  class="disabled:bg-secondary-disabled fixed bottom-6 cursor-pointer right-6 w-16 h-16 hover:w-48 group rounded-full bg-secondary text-secondary-foreground shadow-lg flex items-center justify-center hover:bg-secondary/70 transition-all duration-150 active:scale-95"
>
  {#if children}
    {@render children?.()}
  {/if}

  <span class="ml-3 hidden group-hover:block">{label}</span>
</button>
