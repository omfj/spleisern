<script lang="ts">
	import '../app.css';

	import { setUserContext } from '$lib/context/user-context';
	import { writable } from 'svelte/store';

	let { children, data } = $props();

	const user = writable(data.user);
	$effect.pre(() => {
		user.set(data.user);
	});
	setUserContext(user);
</script>

{@render children()}
