<script lang="ts">
	import { createProductStore } from '$lib/stores/product.svelte';

	type Props = {
		productStore: ReturnType<typeof createProductStore>;
	};

	let { productStore } = $props<Props>();
</script>

{#if productStore.members.length > 1 && productStore.products.length > 0}
	<div class="border p-4 space-y-2 rounded-lg">
		<h2 class="text-2xl">Utbetalinger</h2>

		<div class="relative overflow-hidden rounded-md border">
			<table class="table w-full">
				<thead class="bg-gray-100 text-gray-700 border-b">
					<tr>
						<th scope="col" class="text-left p-2">Navn</th>
						<th scope="col" class="text-left p-2">Kostnad</th>
					</tr>
				</thead>
				<tbody>
					{#each productStore.members as member}
						<tr class="even:bg-gray-100 odd:bg-gray-50">
							<th scope="row" class="text-left p-2 font-normal">{member}</th>
							<td class="text-left p-2">{productStore.totalForMember(member).toFixed(2)} kr</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
