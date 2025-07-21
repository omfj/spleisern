<script lang="ts">
	import Heading from '$lib/components/heading.svelte';
	import { formatDate } from '$lib/utils/date';
	import { Globe, Lock } from '@lucide/svelte';

	let { data } = $props();
	let spleis = $derived(data.spleis);

	function getMemberName(memberId: string): string {
		return spleis.members.find((m) => m.id === memberId)?.name || 'Unknown Member';
	}

	function getAssignedMembers(productId: string) {
		const memberIds = spleis.assignments[productId] || [];
		return memberIds.map((id) => getMemberName(id));
	}
</script>

<svelte:head>
	<title>{spleis.name} - Spleis</title>
</svelte:head>

<div class="mx-auto w-full max-w-4xl space-y-8">
	<!-- Header -->
	<div class="border-b border-gray-200 pb-6">
		<Heading level={1} class="mb-2">{spleis.name}</Heading>
		{#if spleis.description}
			<p class="text-gray-600">{spleis.description}</p>
		{/if}
		<div class="mt-4 flex items-center gap-4 text-sm text-gray-500">
			<span>Created {formatDate(new Date(spleis.createdAt))}</span>
			<span>•</span>
			<span class="inline-flex items-center gap-1">
				{#if spleis.isPublic}
					<Globe class="size-4" />

					Public
				{:else}
					<Lock class="size-4" />

					Private
				{/if}
			</span>
			<span>•</span>
			<span class="font-semibold text-emerald-600">
				Total: {spleis.totalAmount.toFixed(2)} NOK
			</span>
		</div>
	</div>

	<div class="grid gap-8 lg:grid-cols-2">
		<!-- Products Section -->
		<div class="space-y-4">
			<h2 class="text-xl font-semibold">Products</h2>
			<div class="overflow-hidden rounded-lg border-3 border-gray-300">
				<table class="w-full">
					<thead class="border-b-3 border-gray-300 bg-gray-50">
						<tr>
							<th class="px-4 py-3 text-left text-sm font-medium text-gray-900">Product</th>
							<th class="px-4 py-3 text-right text-sm font-medium text-gray-900">Price</th>
							<th class="px-4 py-3 text-left text-sm font-medium text-gray-900">Assigned to</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white">
						{#each spleis.products as product (product.id)}
							<tr class="hover:bg-gray-50">
								<td class="px-4 py-3 text-sm text-gray-900">{product.name}</td>
								<td class="px-4 py-3 text-right text-sm text-gray-900">
									{product.price.toFixed(2)} NOK
								</td>
								<td class="px-4 py-3 text-sm text-gray-600">
									{getAssignedMembers(product.id).join(', ')}
								</td>
							</tr>
						{/each}
					</tbody>
					<tfoot class="bg-gray-50">
						<tr>
							<td class="px-4 py-3 text-sm font-semibold text-gray-900">Total</td>
							<td class="px-4 py-3 text-right text-sm font-semibold text-gray-900">
								{spleis.totalAmount.toFixed(2)} NOK
							</td>
							<td class="px-4 py-3"></td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>

		<!-- Members & Costs Section -->
		<div class="space-y-4">
			<h2 class="text-xl font-semibold">Member Breakdown</h2>
			<div class="space-y-4">
				{#each spleis.memberCosts as memberCost (memberCost.memberId)}
					<div class="rounded-lg border-3 border-gray-300 p-4">
						<div class="mb-3 flex items-center justify-between">
							<h3 class="text-lg font-medium">{memberCost.memberName}</h3>
							<span class="font-semibold text-emerald-600">
								{memberCost.totalCost.toFixed(2)} NOK
							</span>
						</div>

						{#if memberCost.assignedProducts.length > 0}
							<div class="space-y-2">
								{#each memberCost.assignedProducts as product (product.productId)}
									<div class="flex items-center justify-between text-sm">
										<span class="text-gray-700">{product.productName}</span>
										<span class="text-gray-600">
											{product.memberShare.toFixed(2)} NOK
										</span>
									</div>
								{/each}
							</div>
						{:else}
							<p class="text-sm text-gray-500">No products assigned</p>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Summary Statistics -->
	<div class="rounded-lg border-3 border-gray-300 bg-gray-50 p-6">
		<h2 class="mb-4 text-xl font-semibold">Summary</h2>
		<div class="grid gap-4 sm:grid-cols-3">
			<div class="text-center">
				<div class="text-2xl font-bold text-emerald-600">{spleis.members.length}</div>
				<div class="text-sm text-gray-600">Members</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-emerald-600">{spleis.products.length}</div>
				<div class="text-sm text-gray-600">Products</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-emerald-600">{spleis.totalAmount.toFixed(2)} NOK</div>
				<div class="text-sm text-gray-600">Total Amount</div>
			</div>
		</div>
	</div>
</div>
