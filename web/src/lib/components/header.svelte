<script lang="ts">
	import { getAuthenticatedUser } from '$lib/context/user-context';
	import { goto } from '$app/navigation';
	import ButtonLink from './button-link.svelte';
	import Button from './button.svelte';

	let user = getAuthenticatedUser();

	async function handleLogout() {
		try {
			const response = await fetch('/api/auth/logout', {
				method: 'POST'
			});

			if (response.ok) {
				goto('/login');
			}
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}
</script>

<header class="item-center flex justify-between border-b-3 border-gray-300 px-4 py-4 md:px-10">
	<menu class="flex items-center gap-2">
		<li>
			<a class="text-2xl font-bold hover:underline" href="/">💰 Spleis</a>
		</li>
	</menu>

	<menu class="flex items-center gap-4">
		<li>
			<ButtonLink href="/spleis/create">Create Spleis</ButtonLink>
		</li>
		<li>
			<ButtonLink variant="ghost" href="/">{$user.name}</ButtonLink>
		</li>
		<li>
			<Button variant="ghost" onclick={handleLogout}>Log out</Button>
		</li>
	</menu>
</header>
