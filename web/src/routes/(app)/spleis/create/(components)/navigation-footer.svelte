<script lang="ts">
	import Button from '$lib/components/button.svelte';

	type Props = {
		currentStep: number;
		totalSteps: number;
		canProceed: boolean;
		onPrevious: () => void;
		onNext: () => void;
		onSubmit: () => void;
		onReset: () => void;
		isSubmitting?: boolean;
	};

	let {
		currentStep,
		totalSteps,
		canProceed,
		onPrevious,
		onNext,
		onSubmit,
		onReset,
		isSubmitting = false
	}: Props = $props();

	const isFirstStep = $derived(currentStep === 1);
	const isLastStep = $derived(currentStep === totalSteps);
</script>

<div class="mt-8 flex justify-between">
	{#if isFirstStep}
		<Button variant="danger" onclick={onReset}>Reset</Button>
	{:else}
		<Button variant="ghost" onclick={onPrevious}>← Previous</Button>
	{/if}

	{#if !isLastStep}
		<Button onclick={onNext} disabled={!canProceed || isSubmitting}>Next →</Button>
	{:else}
		<Button onclick={onSubmit} disabled={!canProceed || isSubmitting}>
			{#if isSubmitting}
				Creating...
			{:else}
				Create Spleis
			{/if}
		</Button>
	{/if}
</div>
