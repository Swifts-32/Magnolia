<script lang="ts">
  import type { Snippet } from "svelte";

  // onclick?: () => void;
  interface Props {
    label: string;
    disabled?: boolean;
    children: Snippet;
  }

  // onclick = () => {},
  let { label, children, disabled = false }: Props = $props();
</script>

<!-- {disabled} -->
<div
  class="disabled:bg-secondary-disabled fixed bottom-6 cursor-pointer right-6 w-16 h-16 hover:w-48 group rounded-full bg-secondary text-secondary-foreground shadow-lg flex items-center justify-center hover:bg-secondary/70 transition-all duration-150 active:scale-95"
>
  {@render children?.()}

  <span class="ml-3 hidden group-hover:block">{label}</span>
</div>
