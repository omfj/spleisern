<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';

	let { children } = $props();
</script>

<Toaster />

<main class="max-w-2xl mx-auto w-full px-4">
	{@render children()}
</main>
