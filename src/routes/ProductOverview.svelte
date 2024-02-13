<script lang="ts">
	import { createProductStore } from '$lib/stores/product.svelte';
	import { check } from 'drizzle-orm/mysql-core';

	type Props = {
		productStore: ReturnType<typeof createProductStore>;
	};

	let { productStore } = $props<Props>();
</script>

{#if productStore.products.length > 0 && productStore.members.length > 1}
	<div class="border p-4 space-y-2 rounded-lg">
		<h2 class="text-2xl">Fordel kjøp</h2>

		<div class="relative overflow-hidden rounded-md border">
			<table class="table w-full">
				<thead class="bg-gray-100 text-gray-700 border-b">
					<tr>
						<th scope="col" class="text-left p-2">Vare</th>
						<th scope="col" class="text-left p-2">Pris</th>
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
										checked={product.members.includes(member)}
										onclick={(e) => {
											if (e.currentTarget.checked) {
												productStore.addMemberToProduct(product.name, member);
											} else {
												productStore.removeMemberFromProduct(product.name, member);
											}
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
{/if}
