<script lang="ts">
	import { formatDate } from '$lib/utils/date';
	import Heading from '$lib/components/heading.svelte';
	import Text from '$lib/components/text.svelte';
	import { Lock, Globe, ScrollText } from '@lucide/svelte';

	let { data } = $props();

	const { user, settlements } = data;
</script>

<svelte:head>
	<title>Your Account - Spleis</title>
</svelte:head>

<div class="mx-auto w-full max-w-6xl space-y-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<Heading level={1} class="mb-2">Your Account</Heading>
			<Text class="text-gray-600">Welcome back, {user.name}!</Text>
		</div>
	</div>

	<!-- Statistics -->
	<div class="grid gap-4 sm:grid-cols-2">
		<div class="border-3 rounded-lg border-gray-300 bg-gray-50 p-6 text-center">
			<div class="text-2xl font-bold text-emerald-600">{settlements.length}</div>
			<div class="text-sm text-gray-600">Total Spleis</div>
		</div>
		<div class="border-3 rounded-lg border-gray-300 bg-gray-50 p-6 text-center">
			<div class="text-2xl font-bold text-emerald-600">
				{settlements.reduce((sum, s) => sum + s.totalAmount, 0).toFixed(2)} NOK
			</div>
			<div class="text-sm text-gray-600">Total Amount</div>
		</div>
	</div>

	<!-- Spleis List -->
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<Heading level={2}>Your Spleis</Heading>
			<Text class="text-gray-500">{settlements.length} total</Text>
		</div>

		{#if settlements.length === 0}
			<div class="border-3 rounded-lg border-gray-300 bg-gray-50 p-12 text-center">
				<ScrollText class="mx-auto mb-4 size-12 text-gray-400" />
				<Heading level={3} class="mb-2 text-gray-600">No Spleis Yet</Heading>
				<Text class="mb-4 text-gray-500"
					>Create your first spleis to start splitting expenses with friends!</Text
				>
			</div>
		{:else}
			<div class="grid gap-6 md:grid-cols-2">
				{#each settlements as settlement (settlement.id)}
					<a
						href="/spleis/{settlement.id}"
						class="border-3 group block rounded-lg border-gray-300 bg-white p-6 transition-all hover:border-emerald-500 hover:shadow-md"
					>
						<div class="mb-3 flex items-start justify-between">
							<div class="flex-1">
								<h3 class="font-semibold text-gray-900 group-hover:text-emerald-600">
									{settlement.name}
								</h3>
								{#if settlement.description}
									<p class="mt-1 line-clamp-2 text-sm text-gray-600">
										{settlement.description}
									</p>
								{/if}
							</div>
							<div class="ml-3 flex items-center gap-1 text-xs text-gray-500">
								{#if settlement.isPublic}
									<Globe class="size-3" />

									Public
								{:else}
									<Lock class="size-3" />

									Private
								{/if}
							</div>
						</div>

						<div class="mb-3 flex items-center justify-between text-sm">
							<span class="text-gray-600">
								{settlement.memberCount} member{settlement.memberCount !== 1 ? 's' : ''} •
								{settlement.productCount} product{settlement.productCount !== 1 ? 's' : ''}
							</span>
							<span class="font-semibold text-emerald-600">
								{settlement.totalAmount.toFixed(2)} NOK
							</span>
						</div>

						<div class="text-xs text-gray-500">
							Created {formatDate(new Date(settlement.createdAt))}
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
