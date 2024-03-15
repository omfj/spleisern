<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let { class: className, children, ...props } = $props<HTMLButtonAttributes>();
</script>

<button
	class={cn(
		'border text-gray-600 px-2 py-1 bg-gray-100 hover:bg-gray-200 hover:border-gray-300 rounded-md transition-colors',
		className,
	)}
	{...props}
>
	<slot />
</button>
