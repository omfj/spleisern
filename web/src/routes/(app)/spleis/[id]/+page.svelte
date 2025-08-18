<script lang="ts">
	import Heading from '$lib/components/heading.svelte';
	import { formatDate } from '$lib/utils/date';
	import { Globe, Lock, Share, Copy, Check, Trash2 } from '@lucide/svelte';
	import Button from '$lib/components/button.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let spleis = $derived(data.spleis);
	let copied = $state(false);
	let showDeleteConfirm = $state(false);
	let isDeleting = $state(false);

	let isOwner = $derived(data.currentUser?.id === spleis.owner);

	function getMemberName(memberId: string): string {
		return spleis.members.find((m) => m.id === memberId)?.name || 'Unknown Member';
	}

	function getAssignedMembers(productId: string) {
		const memberIds = spleis.assignments[productId] || [];
		return memberIds.map((id) => getMemberName(id));
	}

	async function handleShare() {
		const shareData = {
			title: `${spleis.name} - Spleis`,
			text: `Check out this expense split: ${spleis.name}`,
			url: window.location.href
		};

		if (navigator.share && navigator.canShare?.(shareData)) {
			try {
				await navigator.share(shareData);
			} catch (error) {
				// User cancelled or error occurred, fallback to clipboard
				await copyToClipboard();
			}
		} else {
			await copyToClipboard();
		}
	}

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(window.location.href);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (error) {
			console.error('Failed to copy to clipboard:', error);
		}
	}

	async function deleteSpleis() {
		if (!isOwner) return;

		isDeleting = true;
		try {
			const response = await fetch(`/api/spleis/${spleis.id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				const errorData = (await response.json()) as { error?: string };
				throw new Error(errorData.error || 'Failed to delete spleis');
			}

			// Redirect to home after successful deletion
			await goto('/');
		} catch (error) {
			console.error('Error deleting spleis:', error);
			alert('Failed to delete spleis. Please try again.');
		} finally {
			isDeleting = false;
			showDeleteConfirm = false;
		}
	}
</script>

<svelte:head>
	<title>{spleis.name} - Spleis</title>
	{#if spleis.description}
		<meta name="description" content={spleis.description} />
		<meta property="og:description" content={spleis.description} />
	{/if}
	<meta property="og:title" content={spleis.name} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={window.location.href} />
</svelte:head>

<div class="mx-auto w-full max-w-4xl space-y-8">
	<!-- Header -->
	<div class="border-b border-gray-200 pb-6">
		<Heading level={1} class="mb-2">{spleis.name}</Heading>
		{#if spleis.description}
			<p class="text-gray-600">{spleis.description}</p>
		{/if}
		<div class="mt-4 flex items-center justify-between">
			<div class="flex items-center gap-4 text-sm text-gray-500">
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

			<Button
				variant="outline"
				onclick={handleShare}
				class="bg-background flex h-8 items-center gap-2 px-3 py-1 text-sm"
			>
				{#if copied}
					<Check class="size-4" />
					Copied!
				{:else}
					<Share class="size-4" />
					Share
				{/if}
			</Button>
		</div>
	</div>

	<div class="grid gap-8 lg:grid-cols-2">
		<!-- Products Section -->
		<div class="space-y-4">
			<h2 class="text-xl font-semibold">Products</h2>
			<div class="border-3 overflow-hidden rounded-lg border-gray-300">
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
					<div class="bg-background border-3 rounded-lg border-gray-300 p-4">
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
	<div class="border-3 rounded-lg border-gray-300 bg-gray-50 p-6">
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

	<!-- Delete Section (Only for owner) -->
	{#if isOwner}
		<div class="border-t border-red-200 pt-6">
			<div class="rounded-lg border border-red-200 bg-red-50 p-6">
				<h2 class="mb-2 text-lg font-semibold text-red-800">Danger Zone</h2>
				<p class="mb-4 text-sm text-red-700">
					Once you delete this spleis, there is no going back. This will permanently delete the
					spleis and all associated data.
				</p>
				<Button
					variant="outline"
					onclick={() => (showDeleteConfirm = true)}
					class="border-red-300 text-red-700 hover:bg-red-100"
				>
					<Trash2 class="mr-2 size-4" />
					Delete Spleis
				</Button>
			</div>
		</div>
	{/if}
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
		<div class="mx-4 max-w-md rounded-lg bg-white p-6 shadow-xl">
			<h3 class="mb-2 text-lg font-semibold text-gray-900">Delete Spleis</h3>
			<p class="mb-4 text-sm text-gray-600">
				Are you sure you want to delete "<strong>{spleis.name}</strong>"? This action cannot be
				undone and will permanently delete all associated data including members, products, and
				assignments.
			</p>
			<div class="flex gap-3">
				<Button
					variant="outline"
					onclick={() => (showDeleteConfirm = false)}
					disabled={isDeleting}
					class="flex-1"
				>
					Cancel
				</Button>
				<Button onclick={deleteSpleis} disabled={isDeleting} variant="danger">
					{#if isDeleting}
						Deleting...
					{:else}
						<Trash2 class="mr-2 size-4" />
						Delete
					{/if}
				</Button>
			</div>
		</div>
	</div>
{/if}
