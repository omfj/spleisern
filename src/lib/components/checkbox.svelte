<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = Omit<HTMLInputAttributes, 'type'>;

	let { checked = $bindable(), class: className, ...props }: Props = $props();
</script>

<input
	type="checkbox"
	bind:checked
	class={cn(
		'size-5 rounded border-2 border-gray-300 bg-white text-emerald-500 ring-offset-2 checked:bg-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none',
		className
	)}
	{...props}
/>
