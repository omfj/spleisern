<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { createProductStore, type Product } from '$lib/stores/product.svelte';

	let productStore = createProductStore();
	let currentProduct = $state<Product>({
		name: '',
		price: 0,
		members: [],
	});
	let currentMember = $state<string>('');
</script>

<svelte:head>
	<title>PiKK Accouting</title>
</svelte:head>

<div class="space-y-4 py-10">
	<h1 class="text-3xl">PiKK Accouting</h1>

	<div class="flex flex-col gap-4">
		<div class="border p-4 space-y-2">
			<h2 class="text-2xl">Add Member</h2>

			<Input type="text" bind:value={currentMember} placeholder="Member Name" class="w-full" />

			<Button
				onclick={() => {
					const curr = currentMember.trim();
					if (!Boolean(curr)) return;
					productStore.members.push(curr);
					currentMember = '';
				}}
			>
				Add Member
			</Button>

			<ul class="mt-4 space-y-2">
				{#each productStore.members as member}
					<li>
						<input type="text" bind:value={member} placeholder="Member Name" class="w-full" />
					</li>
				{/each}
			</ul>
		</div>

		<div class="border p-4 space-y-2">
			<h2 class="text-2xl">Add Product</h2>

			<Input
				type="text"
				bind:value={currentProduct.name}
				placeholder="Product Name"
				class="w-full"
			/>

			<Input
				type="number"
				bind:value={currentProduct.price}
				placeholder="Product Price"
				class="w-full"
			/>

			<Button
				onclick={() => {
					productStore.addProduct(currentProduct);
					currentProduct = {
						name: '',
						price: 0,
						members: [],
					};
				}}
			>
				Add Product
			</Button>
		</div>

		<div class="border p-4">
			<h2 class="text-2xl">Products</h2>

			<div class="relative overflow-hidden rounded-md border">
				<table class="table w-full">
					<thead class="bg-gray-300 text-gray-700">
						<tr>
							<th scope="col" class="text-left p-2">Product</th>
							<th scope="col" class="text-left p-2">Price</th>
							{#each productStore.members as member}
								<th scope="col" class="text-center p-2">{member}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each productStore.products as product}
							<tr class="even:bg-gray-100 odd:bg-gray-50">
								<th scope="row" class="text-left p-2 font-normal">{product.name}</th>
								<td class="text-left p-2">{product.price} kr</td>
								{#each productStore.members as member}
									<td class="text-center p-2">
										<input
											type="checkbox"
											onchange={(e) => {
												productStore.toggleMemberToProduct(product.name, member);
											}}
										/>
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<div class="border p-4">
			<h2 class="text-2xl">Total</h2>

			<ul>
				{#each productStore.members as member}
					<li>
						<div class="flex items-center justify-between">
							<p>{member}</p>
							<p>{productStore.totalForMember(member)} kr</p>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
