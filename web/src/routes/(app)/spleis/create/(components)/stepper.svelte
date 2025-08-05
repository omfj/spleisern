<script lang="ts">
	import type { Spleis } from '$lib/types';

	type Step = {
		title: string;
		canProceed: (spleis: Spleis) => boolean;
	};

	type Props = {
		steps: Array<Step>;
		currentStep: number;
		spleis: Spleis;
		onStepClick: (stepNumber: number) => void;
	};

	let { steps, currentStep = $bindable(), spleis = $bindable(), onStepClick }: Props = $props();

	function canNavigateToStep(stepIndex: number): boolean {
		// Can always go back to previous steps
		if (stepIndex + 1 < currentStep) {
			return true;
		}

		// Can go to current step
		if (stepIndex + 1 === currentStep) {
			return true;
		}

		// Can go to next step only if current step is valid
		if (stepIndex + 1 === currentStep + 1) {
			return steps[currentStep - 1]?.canProceed(spleis) ?? false;
		}

		// Can't skip ahead more than one step
		return false;
	}
</script>

<div class="mb-8">
	<div class="flex items-center justify-between">
		<div class="flex flex-wrap items-center gap-4">
			{#each steps as step, index (step.title)}
				<div class="flex items-center">
					<button
						type="button"
						class="h-8 w-8 shrink-0 rounded-full {currentStep >= index + 1
							? 'bg-emerald-500 text-white'
							: 'bg-gray-200 text-gray-600'} flex items-center justify-center text-sm font-medium {canNavigateToStep(
							index
						)
							? 'cursor-pointer hover:opacity-80'
							: 'cursor-not-allowed'}"
						onclick={() => {
							if (canNavigateToStep(index)) {
								onStepClick(index + 1);
							}
						}}
						disabled={!canNavigateToStep(index)}
					>
						{index + 1}
					</button>
					<span
						class="ml-2 text-sm {currentStep >= index + 1 ? 'text-emerald-500' : 'text-gray-500'}"
					>
						{step.title}
					</span>
				</div>
			{/each}
		</div>
	</div>
</div>
