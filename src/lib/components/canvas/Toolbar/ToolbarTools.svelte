<script lang="ts">
    import type { Snippet } from "svelte";

	interface Props {
		name: string;
		rows?: number;
		children?: Snippet;
	}

	let { name, rows = 2, children }: Props = $props();
</script>

<div class="grid justify-items-stretch ml-2 mr-2 h-full">
	<div class="grid place-content-center grid-flow-col gap-2 grid-rows-2" style="grid-template-rows: repeat({rows}, minmax(0, 1fr));">
		{@render children?.()}
	</div>
	<p class="justify-self-center content-end pt-2">{name}</p>
</div>
