<script lang="ts">
	import type { createProductStore } from '$lib/stores/product.svelte';
	import AddMember from './AddMember.svelte';
	import AddProduct from './AddProduct.svelte';
	import ProductOverview from './ProductOverview.svelte';
	import Total from './Total.svelte';
	import Button from './ui/Button.svelte';

	type Props = {
		productStore: ReturnType<typeof createProductStore>;
	};

	let { productStore }: Props = $props();

	const handleReset = () => productStore.reset();
</script>

<Button onclick={handleReset}>Reset</Button>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
	<AddMember {productStore} />
	<AddProduct {productStore} />
	<ProductOverview {productStore} />
	<Total {productStore} />
</div>
