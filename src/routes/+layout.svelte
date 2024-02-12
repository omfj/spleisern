<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';

	let { children } = $props();
</script>

<Toaster />

<main class="max-w-7xl mx-auto w-full px-4">
	{@render children()}
</main>
