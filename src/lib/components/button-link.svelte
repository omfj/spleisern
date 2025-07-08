<script lang="ts">
	import { buttonStyles, type ButtonVariant } from '$lib/styles';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = HTMLAnchorAttributes & {
		variant?: ButtonVariant;
	};

	let { variant = 'primary', class: className, children, ...props }: Props = $props();
</script>

<a class={buttonStyles(variant, 'link', className)} {...props}>
	{@render children?.()}
</a>
