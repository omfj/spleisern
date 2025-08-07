<script lang="ts">
	import { buttonStyles, type ButtonVariants } from '$lib/styles';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface Props extends HTMLAnchorAttributes, ButtonVariants {}

	let { variant, class: className, children, ...props }: Props = $props();
</script>

<a class={buttonStyles({ variant, modifier: 'link', className })} {...props}>
	{@render children?.()}
</a>
