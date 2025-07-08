<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type Props = HTMLTextareaAttributes;

	let { value = $bindable(), class: className, ...props }: Props = $props();
</script>

<textarea
	bind:value
	class={cn(
		'rounded-lg border-3 border-gray-300 ring-offset-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none',
		className
	)}
	rows={5}
	{...props}
></textarea>
