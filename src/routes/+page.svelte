<script lang="ts">
	import Calculator from '$lib/components/Calculator.svelte';
	import { createProductStore } from '$lib/stores/product.svelte';

	let productStore = createProductStore();
</script>

<svelte:head>
	<title>PiKK Accouting</title>
</svelte:head>

<div class="py-10 space-y-10">
	<div class="space-y-4">
		<h1 class="text-4xl">Spleiser'n</h1>

		<p class="text-gray-600">En enkel app for å holde styr på hvem som har betalt for hva.</p>

		<Calculator {productStore} />
	</div>

	<div>
		<a
			class="text-sm text-gray-600 font-medium hover:underline"
			href="https://github.com/omfj"
			target="_blank"
			rel="noopener"
		>
			Laget med ❤️ av omfj
		</a>
	</div>
</div>
