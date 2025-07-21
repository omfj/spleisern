<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = HTMLAnchorAttributes & {
		isExternal?: boolean;
	};

	let { isExternal = false, class: className, children, ...rest }: Props = $props();
</script>

<a
	{...rest}
	class={cn(
		'text-base text-blue-500 transition-all duration-200 hover:text-blue-400 hover:underline',
		className
	)}
	target={isExternal ? '_blank' : undefined}
	rel={isExternal ? 'noopener noreferrer' : undefined}
>
	{@render children?.()}
</a>
