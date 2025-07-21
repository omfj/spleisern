<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes;

	let { value = $bindable(), class: className, ...props }: Props = $props();
</script>

<input
	bind:value
	class={cn(
		'h-10 rounded-lg border-3 border-gray-300 ring-offset-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none',
		className
	)}
	{...props}
/>
