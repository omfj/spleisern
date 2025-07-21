<script lang="ts">
	import { getAuthenticatedUser } from '$lib/context/user-context';
	import ButtonLink from './button-link.svelte';

	let user = getAuthenticatedUser();
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
			<ButtonLink variant="ghost" href="/account">{$user.name}</ButtonLink>
		</li>
	</menu>
</header>
