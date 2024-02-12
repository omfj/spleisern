<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let { class: className, value, ...props } = $props<HTMLInputAttributes>();
</script>

<input class={cn('border px-2 py-1 bg-gray-100 rounded-md', className)} bind:value {...props} />
