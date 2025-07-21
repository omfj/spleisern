<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/button.svelte';
	import Input from '$lib/components/input.svelte';
	import Label from '$lib/components/label.svelte';
	import Link from '$lib/components/link.svelte';
</script>

<div class="relative flex min-h-screen flex-col">
	<main
		class="mx-auto -mt-20 flex min-h-screen w-full max-w-sm flex-col items-center justify-center"
	>
		<form class="flex w-full flex-col gap-2" method="post" use:enhance>
			<div class="flex flex-col gap-1">
				<Label for="password">Account Number</Label>
				<Input type="password" id="password" name="password" required />
			</div>

			<Button class="w-full" type="submit">Log in</Button>
		</form>

		<Link href="/register" class="mt-4 text-center text-sm"
			>Don't have an account? Register here.</Link
		>
	</main>
</div>
