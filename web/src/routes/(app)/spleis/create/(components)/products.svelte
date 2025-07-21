<script lang="ts">
	import { nanoid } from 'nanoid';
	import Input from '$lib/components/input.svelte';
	import Label from '$lib/components/label.svelte';
	import Button from '$lib/components/button.svelte';
	import FileUpload from '$lib/components/file-upload.svelte';
	import { Trash2 } from '@lucide/svelte';
	import type { Spleis } from '$lib/types';
	import type { ReceiptOCRResponse } from '../../../../api/ocr/+server';

	type Props = {
		spleis: Spleis;
	};

	let { spleis = $bindable() }: Props = $props();

	let productName = $state('');
	let productPrice = $state<number | null>(null);
	let previousFiles = $state<FileList | null>(null);
	let files = $state<FileList | null>(null);
	let ocrLoading = $state(false);
	let ocrError = $state<string | null>(null);

	let isValid = $derived(productName.trim() !== '' && Boolean(productPrice));
	let isFormDisabled = $derived(ocrLoading);

	function addProduct() {
		if (!isValid) return;

		spleis.products.push({
			id: nanoid(),
			name: productName.trim(),
			price: productPrice! // We do the null check above
		});

		productName = '';
		productPrice = 0;
	}

	function removeProduct(productId: string) {
		spleis.products = spleis.products.filter((p) => p.id !== productId);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addProduct();
		}
	}

	async function getOcrResult() {
		if (!files || files.length === 0) return;

		ocrLoading = true;
		ocrError = null;

		try {
			const file = files[0];
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('/api/ocr', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error(`OCR request failed: ${response.statusText}`);
			}

			const data = (await response.json()) as ReceiptOCRResponse['products'];

			data.forEach((product) => {
				spleis.products.push({
					id: nanoid(),
					name: product.name,
					price: product.price
				});
			});
		} catch (error) {
			ocrError = error instanceof Error ? error.message : 'Failed to process the uploaded file';
		} finally {
			ocrLoading = false;
			files = null;
		}
	}

	$effect(() => {
		if (files && files !== previousFiles && files.length > 0 && !ocrLoading) {
			previousFiles = files;
			getOcrResult();
		}
	});
</script>

<div class="w-full space-y-6">
	<h2 class="text-xl font-semibold">Add Products</h2>

	<div class="space-y-4">
		<div class="rounded-lg border-3 border-gray-300 bg-gray-50 p-4">
			<h3 class="mb-3 text-lg font-medium">Upload Bill (Optional)</h3>
			<p class="mb-4 text-sm text-gray-600">
				Upload a bill to automatically extract products and prices using OCR.
			</p>

			{#if ocrLoading}
				<div class="mb-4 rounded-lg bg-blue-50 p-3 text-center">
					<p class="text-sm text-blue-700">Processing your bill with OCR...</p>
					<div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-blue-200">
						<div class="h-full animate-pulse bg-blue-500"></div>
					</div>
				</div>
			{/if}

			{#if ocrError}
				<div class="mb-4 rounded-lg bg-red-50 p-3">
					<p class="text-sm text-red-700">Error: {ocrError}</p>
				</div>
			{/if}

			<FileUpload
				id="bill"
				name="bill"
				accept=".pdf"
				placeholder="Upload your bill for automatic product extraction"
				bind:files
				disabled={ocrLoading}
			/>
		</div>
	</div>

	<div class="space-y-4">
		<div
			class="grid grid-cols-1 gap-4 md:grid-cols-3 {isFormDisabled
				? 'pointer-events-none opacity-50'
				: ''}"
		>
			<div class="flex flex-col gap-2">
				<Label for="productName">Product Name</Label>
				<Input
					id="productName"
					type="text"
					bind:value={productName}
					placeholder="Enter product name"
					onkeydown={handleKeyDown}
					disabled={isFormDisabled}
				/>
			</div>
			<div class="flex flex-col gap-2">
				<Label for="productPrice">Price</Label>
				<Input
					id="productPrice"
					type="number"
					step="0.01"
					min="0"
					bind:value={productPrice}
					placeholder="0.00"
					onkeydown={handleKeyDown}
					disabled={isFormDisabled}
				/>
			</div>
			<div class="flex flex-col gap-2">
				<Label>&nbsp;</Label>
				<Button type="button" onclick={addProduct} disabled={!isValid || isFormDisabled}
					>Add Product</Button
				>
			</div>
		</div>

		<p class="text-sm text-gray-500">
			Enter product name and price, then click "Add Product" or press Enter to add to the list.
		</p>
	</div>

	{#if spleis.products.length > 0}
		<div class="space-y-4">
			<h3 class="text-lg font-medium">Products</h3>
			<div class="overflow-hidden rounded-lg border-3 border-gray-300">
				<table class="w-full">
					<thead class="border-b-3 border-gray-300 bg-gray-50">
						<tr>
							<th class="px-4 py-3 text-left text-sm font-medium text-gray-900">Product Name</th>
							<th class="px-4 py-3 text-right text-sm font-medium text-gray-900">Price</th>
							<th class="px-4 py-3 text-right text-sm font-medium text-gray-900">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white">
						{#each spleis.products as product (product.id)}
							<tr class="hover:bg-gray-50">
								<td class="px-4 py-3 text-sm text-gray-900">{product.name}</td>
								<td class="px-4 py-3 text-right text-sm text-gray-900"
									>{product.price.toFixed(2)} NOK</td
								>
								<td class="px-4 py-3">
									<Button
										variant="ghost"
										onclick={() => removeProduct(product.id)}
										class="ml-auto text-red-500 hover:text-red-700"
									>
										<Trash2 class="h-4 w-4" />
									</Button>
								</td>
							</tr>
						{/each}
					</tbody>
					<tfoot class="bg-gray-50">
						<tr>
							<td class="px-4 py-3 text-sm font-semibold text-gray-900">Total</td>
							<td class="px-4 py-3 text-right text-sm font-semibold text-gray-900">
								{spleis.products.reduce((sum, p) => sum + p.price, 0).toFixed(2)} NOK
							</td>
							<td class="px-4 py-3"></td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	{/if}
</div>
