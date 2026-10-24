<script lang="ts">
    import FunctionIcons from "#lib/components/Trains/Functions/FunctionIcons.svelte";
	import Button from "#lib/components/ui/button/button.svelte";
</script>

<div class="grid grid-cols-2 auto-rows-min gap-2 p-0 w-fit h-full">
	{#each Array(8) as _, index}
		<Button
			disabled={true}
			size="icon"
			class="size-14 p-2 flex flex-col gap-1 bg-primary active:bg-secondary active:text-secondary-foreground text-primary-foreground"
			variant="default"
		>
			<FunctionIcons
				size={18}
				selectedIcon={"Text"}
				text={false}
				orientation="vertical"
			/>
			<p>F{index}</p>
		</Button>
	{/each}
</div>
