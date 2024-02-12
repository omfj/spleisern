<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { createProductStore, type Product } from '$lib/stores/product.svelte';
	import { preventDefault } from '$lib/utils';

	type Props = {
		productStore: ReturnType<typeof createProductStore>;
	};

	let { productStore } = $props<Props>();

	let currentProduct = $state<Product>({
		name: '',
		price: 0,
		members: [],
	});

	let nameInput = $state<HTMLInputElement>();
</script>

<div class="border p-5 space-y-2 rounded-lg">
	<h2 class="text-2xl">Legg til vare</h2>

	<form
		class="space-y-2"
		onsubmit={preventDefault(() => {
			productStore.addProduct(currentProduct);
			currentProduct = {
				name: '',
				price: 0,
				members: [],
			};
			nameInput?.focus();
		})}
	>
		<div class="flex items-center gap-1">
			<Input
				bind:node={nameInput}
				type="text"
				bind:value={currentProduct.name}
				placeholder="Melk"
				class="flex-1"
			/>

			<Input type="number" class="max-w-24" bind:value={currentProduct.price} />
		</div>

		<Button class="w-full">Legg til</Button>

		{#if productStore.products.length > 0}
			<hr />

			<ul class="mt-4 space-y-2">
				{#each productStore.products as product}
					<li>
						<div class="flex items-center gap-1">
							<Input
								type="text"
								bind:value={product.name}
								placeholder="Product Name"
								class="flex-1"
							/>

							<Input type="number" class="max-w-24" bind:value={product.price} />

							<Button
								onclick={() => {
									productStore.removeProduct(product.name);
								}}
							>
								Fjern
							</Button>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</form>
</div>
