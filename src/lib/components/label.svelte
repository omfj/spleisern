<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	type Props = HTMLLabelAttributes;

	let { class: className, children, ...props }: Props = $props();
</script>

<label class={cn('text-sm font-medium text-gray-700', className)} {...props}>
	{@render children?.()}
</label>
