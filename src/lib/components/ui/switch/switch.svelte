<script lang="ts">
	import { Switch as SwitchPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	type $$Props = SwitchPrimitive.Props;
	type $$Events = SwitchPrimitive.Events;

	interface Props {
		class?: $$Props["class"];
		checked?: $$Props["checked"];
		disabled?: boolean;
		[key: string]: any;
	}

	let {
		class: className = undefined,
		checked = $bindable(false),
		disabled = false,
		...rest
	}: Props = $props();
</script>

<SwitchPrimitive.Root
	{disabled}
	bind:checked
	class={cn(
		"focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-50",
		className,
	)}
	{...rest}
	on:click
	on:keydown
>
	<SwitchPrimitive.Thumb
		class={cn(
			"bg-background pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
		)}
	/>
</SwitchPrimitive.Root>
