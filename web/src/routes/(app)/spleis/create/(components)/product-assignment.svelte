<script lang="ts">
	import Checkbox from '$lib/components/checkbox.svelte';
	import Label from '$lib/components/label.svelte';
	import type { Spleis } from '$lib/types';

	type Props = {
		spleis: Spleis;
	};

	let { spleis = $bindable() }: Props = $props();

	if (!spleis.assignments) {
		spleis.assignments = {};
		spleis.products.forEach((product) => {
			spleis.assignments[product.id] = [];
		});
	}

	function toggleMemberAssignment(productId: string, memberId: string) {
		if (!spleis.assignments[productId]) {
			spleis.assignments[productId] = [];
		}

		const currentAssignments = spleis.assignments[productId];
		const memberIndex = currentAssignments.indexOf(memberId);

		if (memberIndex === -1) {
			spleis.assignments[productId] = [...currentAssignments, memberId];
		} else {
			spleis.assignments[productId] = currentAssignments.filter((id) => id !== memberId);
		}
	}

	function isMemberAssigned(productId: string, memberId: string): boolean {
		return spleis.assignments[productId]?.includes(memberId) ?? false;
	}

	function getAssignedMembers(productId: string) {
		const assignedMemberIds = spleis.assignments[productId] || [];
		return spleis.members.filter((member) => assignedMemberIds.includes(member.id));
	}

	function getProductCostPerMember(productId: string): number {
		const product = spleis.products.find((p) => p.id === productId);
		const assignedCount = spleis.assignments[productId]?.length || 0;

		if (!product || assignedCount === 0) return 0;
		return product.price / assignedCount;
	}
</script>

<div class="w-full space-y-6">
	<div>
		<h2 class="text-xl font-semibold">Assign Products to Members</h2>
		<p class="mt-1 text-sm text-gray-600">
			Select which members should be assigned to each product. The cost will be split equally among
			assigned members.
		</p>
	</div>

	{#if spleis.products.length === 0}
		<div class="py-8 text-center text-gray-500">
			<p>No products added yet. Please go back and add some products first.</p>
		</div>
	{:else if spleis.members.length === 0}
		<div class="py-8 text-center text-gray-500">
			<p>No members added yet. Please go back and add some members first.</p>
		</div>
	{:else}
		<div class="space-y-6">
			{#each spleis.products as product (product.id)}
				<div class="bg-background rounded-lg border-3 border-gray-300 p-4">
					<div class="mb-4 flex items-center justify-between">
						<div>
							<h3 class="text-lg font-medium">{product.name}</h3>
							<p class="text-sm text-gray-600">Total: {product.price.toFixed(2)} NOK</p>
						</div>
						<div class="text-right">
							<p class="text-sm text-gray-600">
								{#if spleis.assignments[product.id]?.length > 0}
									Cost per person: {getProductCostPerMember(product.id).toFixed(2)} NOK
								{:else}
									No one assigned
								{/if}
							</p>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
						{#each spleis.members as member (member.id)}
							<div class="flex items-center space-x-2">
								<Checkbox
									id="{product.id}-{member.id}"
									checked={isMemberAssigned(product.id, member.id)}
									onchange={() => toggleMemberAssignment(product.id, member.id)}
								/>
								<Label for="{product.id}-{member.id}" class="text-sm">
									{member.name}
								</Label>
							</div>
						{/each}
					</div>

					{#if getAssignedMembers(product.id).length > 0}
						<div class="mt-3 border-t border-gray-200 pt-3">
							<p class="text-sm text-gray-600">
								Assigned to: {getAssignedMembers(product.id)
									.map((m) => m.name)
									.join(', ')}
							</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<div class="rounded-lg border-3 border-gray-300 bg-gray-50 p-4">
			<h3 class="mb-3 text-lg font-medium">Summary</h3>
			<div class="space-y-2">
				{#each spleis.members as member (member.id)}
					{@const memberProducts = spleis.products.filter((p) => isMemberAssigned(p.id, member.id))}
					{@const totalCost = memberProducts.reduce(
						(sum, p) => sum + getProductCostPerMember(p.id),
						0
					)}
					<div class="flex items-center justify-between">
						<span class="font-medium">{member.name}</span>
						<span class="text-gray-600">
							{totalCost.toFixed(2)} NOK
							{#if memberProducts.length > 0}
								<span class="text-sm text-gray-500">
									({memberProducts.length} product{memberProducts.length !== 1 ? 's' : ''})
								</span>
							{/if}
						</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
