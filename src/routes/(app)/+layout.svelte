<script lang="ts">
	import Header from '$lib/components/header.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen w-full flex-col">
	<Header />

	<div class="mx-auto flex w-full max-w-4xl flex-1 flex-col p-4 md:p-8">
		{@render children?.()}
	</div>
</div>
