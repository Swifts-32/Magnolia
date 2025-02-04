<script lang="ts">
	import { Slider, type SliderSingleRootProps } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { Menu } from "lucide-svelte";
	// let {
	// 	value = $bindable(),
	// 	disabled = false,
	// 	class: className,
	// 	...restProps
	// }: props = $props();

	interface props extends SliderSingleRootProps {
		disabled?: boolean;
	}

	let {
		value = $bindable(),
		class: className,
		disabled = false,
		type = "single",
		...restProps
	}: props = $props();
</script>

<!-- bind:value
type="single"
orientation="vertical"
{disabled}
class={cn(
	"relative flex h-full touch-none select-none items-center justify-center",
	className,
)}
{...restProps} -->

<Slider.Root
	bind:value={value as never}
	class={cn(
		"relative flex w-full touch-none select-none items-center justify-center h-full",
		className,
	)}
	{disabled}
	{type}
	{...restProps}
>
	{#snippet children({ thumbs })}
		<span
			class="{disabled
				? ' bg-secondary-disabled'
				: 'bg-secondary'} disabled:bg-secondary-disabled relative h-full w-4 overflow-hidden rounded-full"
		>
			<Slider.Range
				class="{disabled
					? ' bg-primary-disabled'
					: 'bg-primary'} absolute size-full"
			/>
		</span>
		{#each thumbs as thumb}
			<Slider.Thumb
				index={thumb}
				{disabled}
				class="bg-background flex w-7 h-12 items-center justify-center border-primary disabled:border-primary-disabled ring-offset-background focus-visible:ring-ring size-8 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
			>
				<Menu
					class={disabled ? "text-primary-disabled" : "text-primary"}
				/>
			</Slider.Thumb>
		{/each}
	{/snippet}
</Slider.Root>
