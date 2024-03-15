<script lang="ts">
	import Input from './ui/Input.svelte';
	import Button from './ui/Button.svelte';
	import { createProductStore } from '$lib/stores/product.svelte';
	import { preventDefault } from '$lib/utils';

	type Props = {
		productStore: ReturnType<typeof createProductStore>;
	};

	let { productStore } = $props<Props>();

	let currentMember = $state<string>('');
</script>

<div class="border p-4 space-y-2 rounded-lg">
	<h2 class="text-2xl">Legg til person</h2>

	<form
		class="space-y-2"
		onsubmit={preventDefault(() => {
			const curr = currentMember.trim();
			if (!Boolean(curr)) return;
			productStore.members.push(curr);
			currentMember = '';
		})}
	>
		<Input type="text" bind:value={currentMember} placeholder="Ola Nordmann" class="w-full" />

		<Button class="w-full">Legg til</Button>
	</form>

	<hr />

	{#if productStore.members.length === 0}
		<p class="text-red-500 text-center text-sm">Legg til en person</p>
	{/if}

	<ul class="mt-4 space-y-2">
		{#each productStore.members as member}
			<li>
				<div class="flex items-center gap-1">
					<Input type="text" bind:value={member} placeholder="Member Name" class="flex-1" />

					<Button
						onclick={() => {
							productStore.removeMember(member);
						}}
					>
						Fjern
					</Button>
				</div>
			</li>
		{/each}
	</ul>
</div>
