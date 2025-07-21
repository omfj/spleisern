<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLParagraphElement>;

	let { class: className, children, ...props }: Props = $props();
</script>

<p class={cn('leading-tight font-medium tracking-wide text-gray-800', className)} {...props}>
	{@render children?.()}
</p>
