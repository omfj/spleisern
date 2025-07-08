<script lang="ts">
	import { buttonStyles, type ButtonVariant } from '$lib/styles';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = HTMLButtonAttributes & {
		variant?: ButtonVariant;
	};

	let {
		variant = 'primary',
		type = 'button',
		class: className,
		children,
		...props
	}: Props = $props();
</script>

<button {type} class={buttonStyles(variant, 'button', className)} {...props}>
	{@render children?.()}
</button>
