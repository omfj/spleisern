<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatAccountNumber } from '$lib/account-number.js';
	import Button from '$lib/components/button.svelte';
	import Input from '$lib/components/input.svelte';
	import Label from '$lib/components/label.svelte';
	import Link from '$lib/components/link.svelte';
	import Text from '$lib/components/text.svelte';

	let { form } = $props();

	let hasUnderstood = $state(false);
</script>

<div class="relative flex min-h-screen flex-col">
	<main
		class="mx-auto -mt-20 flex min-h-screen w-full max-w-sm flex-col items-center justify-center p-6"
	>
		<div class="w-full space-y-6">
			{#if !hasUnderstood}
				<div class="text-center">
					<h1 class="mb-2 text-2xl font-bold text-gray-900">Create Account</h1>
					<Text class="text-gray-600">
						This site uses a randomly generated account number for each user. This number is used to
						identify your account and is not linked to any personal information. Please remember
						your account number as it will be required for future logins.

						<br />
						<br />

						DO NOT SHARE YOUR ACCOUNT NUMBER WITH ANYONE.
					</Text>
				</div>

				<div class="flex w-full flex-col gap-4">
					<Button onclick={() => (hasUnderstood = true)} variant="danger" class="w-full"
						>I understand.</Button
					>
				</div>
			{:else if !form?.success}
				<form class="flex w-full flex-col gap-4" method="post" use:enhance>
					<div class="flex flex-col gap-1">
						<Label for="name">What should we call you?</Label>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="What do you want to be called?"
							minlength={3}
							maxlength={255}
							required
						/>

						{#if form?.message}
							<Text class="text-sm text-red-600">{form.message}</Text>
						{/if}
					</div>

					<Button class="w-full" type="submit">Generate Account ID</Button>
				</form>
			{:else}
				<div class="flex flex-col items-center gap-4">
					<h1 class="text-2xl font-bold text-gray-900">Account Created</h1>
					<Text class="text-center text-gray-600">
						Your account has been successfully created. Please remember your account number:
					</Text>
					<Input class="w-full text-center" readonly value={formatAccountNumber(form.message)} />

					<Text class="text-sm text-gray-500">
						Please keep this number safe, as it is required for future logins.
					</Text>
				</div>
			{/if}

			<div class="text-center">
				<Link href="/login" class="text-sm">Already have an account? Log in here.</Link>
			</div>
		</div>
	</main>
</div>
