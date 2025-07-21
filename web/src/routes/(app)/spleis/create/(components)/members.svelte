<script lang="ts">
	import { nanoid } from 'nanoid';
	import Input from '$lib/components/input.svelte';
	import Label from '$lib/components/label.svelte';
	import type { Spleis } from '$lib/types';
	import { X } from '@lucide/svelte';

	type Props = {
		spleis: Spleis;
	};

	let { spleis = $bindable() }: Props = $props();

	let membersInput = $state('');
</script>

<div class="space-y-6">
	<h2 class="text-xl font-semibold">Add Members</h2>
	<div class="flex flex-col gap-2">
		<Label for="members">Members</Label>
		{#each spleis.members as member (member.id)}
			<div class="flex items-center gap-2 rounded bg-gray-50 p-2">
				<span class="flex-1 text-sm text-gray-700">{member.name}</span>
				<button
					type="button"
					class="flex h-6 w-6 items-center justify-center text-red-500 hover:text-red-700"
					onclick={() => {
						spleis.members = spleis.members.filter((m) => m.id !== member.id);
					}}
				>
					<X class="size-5" />
				</button>
			</div>
		{/each}
		<Input
			id="members"
			type="text"
			bind:value={membersInput}
			placeholder="Enter member name and press Enter"
			onkeydown={(e) => {
				if (e.key === 'Enter' && membersInput.trim() !== '') {
					e.preventDefault();
					spleis.members.push({ id: nanoid(), name: membersInput.trim() });
					membersInput = '';
				}
			}}
		/>
		<p class="text-sm text-gray-500">
			Add members by entering their names and pressing Enter. You can add email addresses to send
			invitations later.
		</p>
	</div>
</div>
