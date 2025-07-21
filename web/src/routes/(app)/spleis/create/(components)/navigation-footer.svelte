<script lang="ts">
	import { cn } from '$lib/cn';
	import Button from '$lib/components/button.svelte';

	type Props = {
		currentStep: number;
		totalSteps: number;
		canProceed: boolean;
		onPrevious: () => void;
		onNext: () => void;
		onSubmit: () => void;
		isSubmitting?: boolean;
	};

	let {
		currentStep,
		totalSteps,
		canProceed,
		onPrevious,
		onNext,
		onSubmit,
		isSubmitting = false
	}: Props = $props();

	const isFirstStep = $derived(currentStep === 1);
	const isLastStep = $derived(currentStep === totalSteps);
</script>

<div class="mt-8 flex justify-between">
	<Button
		variant="ghost"
		class={cn({
			invisible: isFirstStep,
			visible: !isFirstStep
		})}
		onclick={onPrevious}
	>
		← Previous
	</Button>

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
