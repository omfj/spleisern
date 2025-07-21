<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLHeadingElement> & {
		level: 1 | 2 | 3 | 4 | 5 | 6;
	};

	let { class: className, children, ...props }: Props = $props();

	let Tag = `h${props.level}` as keyof HTMLElementTagNameMap;
</script>

<svelte:element
	this={Tag}
	class={cn(
		'leading-tight font-bold tracking-tight text-gray-900',
		{
			'text-4xl sm:text-5xl': props.level === 1,
			'text-3xl sm:text-4xl': props.level === 2,
			'text-2xl sm:text-3xl': props.level === 3,
			'text-xl sm:text-2xl': props.level === 4,
			'text-lg sm:text-xl': props.level === 5,
			'text-base sm:text-lg': props.level === 6
		},
		className
	)}
	{...props}
>
	{@render children?.()}
</svelte:element>
