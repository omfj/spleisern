<script lang="ts">
	import { buttonStyles, type ButtonVariants } from '$lib/styles';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes, ButtonVariants {}

	let { variant, class: className, children, ...props }: Props = $props();
</script>

<button class={buttonStyles({ variant, className })} {...props}>
	{@render children?.()}
</button>
