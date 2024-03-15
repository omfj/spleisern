<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		node?: HTMLInputElement;
	};

	let { class: className, value, node, ...props } = $props<Props>();
</script>

<input
	bind:this={node}
	class={cn('border px-2 py-1 bg-gray-100 rounded-md', className)}
	bind:value
	{...props}
/>
