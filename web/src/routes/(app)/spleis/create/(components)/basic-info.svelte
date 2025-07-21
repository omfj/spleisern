<script lang="ts">
	import Input from '$lib/components/input.svelte';
	import Label from '$lib/components/label.svelte';
	import Textarea from '$lib/components/textarea.svelte';
	import Checkbox from '$lib/components/checkbox.svelte';

	type Props = {
		spleis: {
			name: string;
			description: string;
			isPublic: boolean;
		};
	};

	let { spleis }: Props = $props();
</script>

<div class="w-full space-y-6">
	<h2 class="text-xl font-semibold">Basic Information</h2>
	<div class="flex flex-col gap-2">
		<Label for="name">Name</Label>
		<Input
			id="name"
			type="text"
			bind:value={spleis.name}
			placeholder="Enter the name of your spleis"
			required
		/>
	</div>

	<div class="flex flex-col gap-2">
		<Label for="description">Description</Label>
		<Textarea
			id="description"
			bind:value={spleis.description}
			placeholder="Describe what this spleis is for"
		/>
	</div>

	<div class="flex items-center gap-2">
		<Checkbox id="isPublic" bind:checked={spleis.isPublic} />
		<Label for="isPublic">Should the spleis be public?</Label>
	</div>
</div>
