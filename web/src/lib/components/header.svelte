<script lang="ts">
	import { getAuthenticatedUser } from '$lib/context/user-context';
	import { beforeNavigate, goto } from '$app/navigation';
	import ButtonLink from './button-link.svelte';
	import Button from './button.svelte';
	import { Menu, X } from '@lucide/svelte';

	let user = getAuthenticatedUser();

	let isOpen = $state(false);

	beforeNavigate(() => {
		isOpen = false;
	});

	function toggleMenu() {
		isOpen = !isOpen;
	}

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

<div class="bg-background">
	<header class="item-center border-b-3 flex justify-between border-gray-300 px-4 py-4 md:px-10">
		<menu class="flex items-center gap-2">
			<li>
				<a class="text-2xl font-bold hover:underline" href="/">💰 Spleis</a>
			</li>
		</menu>

		<menu class="hidden items-center gap-4 sm:flex">
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

		<button onclick={toggleMenu} class="sm:hidden">
			{#if isOpen}
				<X class="size-7" />
			{:else}
				<Menu class="size-7" />
			{/if}
		</button>
	</header>

	{#if isOpen}
		<menu
			class="absolute flex w-full flex-1 flex-col gap-4 border-b-2 border-gray-300 bg-white p-4 md:hidden"
		>
			<li>
				<ButtonLink href="/spleis/create">Create Spleis</ButtonLink>
			</li>
			<li>
				<ButtonLink variant="ghost" href="/">{$user.name}</ButtonLink>
			</li>
			<li>
				<Button class="w-full" variant="ghost" onclick={handleLogout}>Log out</Button>
			</li>
		</menu>
	{/if}
</div>
