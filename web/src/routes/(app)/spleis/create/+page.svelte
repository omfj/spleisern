<script lang="ts">
	import Heading from '$lib/components/heading.svelte';
	import BasicInfo from './(components)/basic-info.svelte';
	import Members from './(components)/members.svelte';
	import Products from './(components)/products.svelte';
	import ProductAssignment from './(components)/product-assignment.svelte';
	import Stepper from './(components)/stepper.svelte';
	import NavigationFooter from './(components)/navigation-footer.svelte';
	import type { Spleis } from '$lib/types';
	import { PersistedState } from 'runed';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	const steps = [
		{
			component: BasicInfo,
			title: 'Basic Info',
			canProceed: (spleis: Spleis) => spleis.name.trim() !== ''
		},
		{
			component: Members,
			title: 'Members',
			canProceed: (spleis: Spleis) => spleis.members.length > 1
		},
		{
			component: Products,
			title: 'Products',
			canProceed: (spleis: Spleis) => spleis.products.length > 0
		},
		{
			component: ProductAssignment,
			title: 'Assign Products',
			canProceed: (spleis: Spleis) => {
				// Check if all products have at least one member assigned
				return spleis.products.every(
					(product) =>
						spleis.assignments &&
						spleis.assignments[product.id] &&
						spleis.assignments[product.id].length > 0
				);
			}
		}
	];

	const CREATE_SPLEIS_KEY = 'create-spleis';
	const SCHEMA_VERSION_KEY = 'create-spleis-schema-version';
	const SCHEMA_VERSION = 'spleis-v3-products-with-upload';

	const defaultSpleis = {
		name: '',
		description: '',
		isPublic: false,
		members: [],
		products: [],
		assignments: {}
	};

	function clearOutdatedStorage() {
		const storedVersion = localStorage.getItem(SCHEMA_VERSION_KEY);
		if (storedVersion !== SCHEMA_VERSION) {
			localStorage.removeItem(CREATE_SPLEIS_KEY);
			localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
		}
	}

	onMount(() => {
		clearOutdatedStorage();
	});

	let currentStep = $state(1);
	const createSpleis = new PersistedState<Spleis>(CREATE_SPLEIS_KEY, defaultSpleis);

	let CurrentStepComponent = $derived(steps[currentStep - 1].component);

	function nextStep() {
		if (currentStep < steps.length) {
			currentStep += 1;
		}
	}

	function prevStep() {
		if (currentStep > 1) {
			currentStep -= 1;
		}
	}

	function canProceed() {
		const currentStepConfig = steps[currentStep - 1];
		return currentStepConfig?.canProceed(createSpleis.current) ?? false;
	}

	function goToStep(stepNumber: number) {
		currentStep = stepNumber;
	}

	let isSubmitting = $state(false);
	let submitError = $state<string | null>(null);

	async function handleSubmit() {
		isSubmitting = true;
		submitError = null;

		try {
			const response = await fetch('/api/spleis', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(createSpleis.current)
			});

			const data = (await response.json()) as {
				spleis: {
					id: string;
				};
			}; // TODO: Add rest of the Spleis type

			if (!response.ok) {
				throw new Error('Failed to create spleis');
			}

			const id = data.spleis.id;

			// Clear the persisted state
			localStorage.removeItem(CREATE_SPLEIS_KEY);

			goto(`/spleis/${id}`);
		} catch (error) {
			submitError = error instanceof Error ? error.message : 'Failed to create spleis';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="mx-auto w-full max-w-2xl">
	<Heading class="mb-8" level={1}>Create Spleis</Heading>

	<Stepper {steps} bind:currentStep bind:spleis={createSpleis.current} onStepClick={goToStep} />

	<CurrentStepComponent bind:spleis={createSpleis.current} />

	{#if submitError}
		<div class="mb-4 rounded-lg bg-red-50 p-4">
			<p class="text-sm text-red-700">Error: {submitError}</p>
		</div>
	{/if}

	<NavigationFooter
		{currentStep}
		totalSteps={steps.length}
		canProceed={canProceed() && !isSubmitting}
		onPrevious={prevStep}
		onNext={nextStep}
		onSubmit={handleSubmit}
		{isSubmitting}
	/>
</div>
