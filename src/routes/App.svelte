<script lang="ts">
	import { createProductStore, type Product } from '$lib/stores/product.svelte';
	import AddMember from './AddMember.svelte';
	import AddProduct from './AddProduct.svelte';
	import ProductOverview from './ProductOverview.svelte';
	import Total from './Total.svelte';

	let productStore = createProductStore();
</script>

<div class="space-y-4 py-10">
	<h1 class="text-4xl">Spleiser'n</h1>

	<p class="text-gray-600">En enkel app for å holde styr på hvem som har betalt for hva.</p>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<AddMember {productStore} />
		<AddProduct {productStore} />
		<ProductOverview {productStore} />
		<Total {productStore} />
	</div>
</div>
