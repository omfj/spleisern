<script lang="ts">
	import Header from '$lib/components/header.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen w-full flex-col">
	<Header />

	<div class="mx-auto flex w-full max-w-4xl flex-1 flex-col p-4 md:p-8">
		{@render children?.()}
	</div>

	<footer class="border-t border-gray-200 bg-gray-50 py-4">
		<div class="mx-auto max-w-4xl px-4 text-center md:px-8">
			<a
				class="text-sm text-gray-600 underline transition-colors hover:text-blue-500"
				href="https://github.com/omfj"
			>
				Made with <span class="text-red-500">♥</span> by omfj
			</a>
		</div>
	</footer>
</div>
