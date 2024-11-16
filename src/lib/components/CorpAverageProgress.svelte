<script lang="ts">
	import { onMount } from 'svelte';
	import moment from 'moment';

	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Tooltip from '$lib/components/ui/tooltip';

	import { usePapService } from '@/models/usePapService';
	const { getCorporationPapMetrics } = usePapService();

	let corpAverageMetrics = null;

	const targetAverage = 8;
	const redSectionLength = (3 / (targetAverage * 2)) * 100;
	const orangeSectionLength = (5 / (targetAverage * 2)) * 100;
	const blueSectionLength = (4 / (targetAverage * 2)) * 100;
	const greenSectionLength = (4 / (targetAverage * 2)) * 100;

	onMount(() => {
		updateCorpAverageMetrics();
	});

	const updateCorpAverageMetrics = async () => {
		corpAverageMetrics = await getCorporationPapMetrics(98718341);
		// corpAverageMetrics.strategicRatio = 14;
	};
</script>

<div class="flex flex-col flex-grow bg-background-900 pb-2 {$$restProps.class}">
	<div class="flex items-center justify-between gap-2 text-xl bg-black px-3 py-1 w-full">
		Corp {moment.utc().format('MMMM')} Average Strategic PAPs

		<Tooltip.Root openDelay={0}>
			<Tooltip.Trigger><i class="fas fa-question-circle text-base" /></Tooltip.Trigger>
			<Tooltip.Content class="bg-background-800">
				<div class="text-sm max-w-96">
					This is the metric the alliance calculates and looks at.<br /><br />
					The alliance compares this metric to all the other corporations by setting a baseline. If we are worse than a third of that baseline,
					we are in trouble.<br /><br />
					We want an average of at least {targetAverage} PAPs per member to be safe.
				</div>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>

	<div class="flex flex-col px-3 mt-2">
		{#if corpAverageMetrics}
			<div class="relative h-14 w-full">
				<div
					class="flex flex-col items-center justify-center absolute font-semibold -mt-2 w-24 bg-background-900 rounded-md
          {corpAverageMetrics.strategicRatio < 3 ? 'text-error-600' : ''}
          {corpAverageMetrics.strategicRatio >= 3 && corpAverageMetrics.strategicRatio < 8 ? 'text-orange-500' : ''}
          {corpAverageMetrics.strategicRatio >= 8 && corpAverageMetrics.strategicRatio < 12 ? 'text-sky-600' : ''}
          {corpAverageMetrics.strategicRatio >= 12 ? 'text-green-600' : ''}"
					style="left: calc({(corpAverageMetrics.strategicRatio / (targetAverage * 2)) * 100}% - 48px)"
				>
					<div class="text-4xl font-semibold">
						{corpAverageMetrics.strategicRatio.toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}
					</div>
					<div class="text-2xl -mt-3">v</div>
				</div>
			</div>
		{:else}
			<div class="relative h-14 w-full">
				<Skeleton class="h-12 mb-2 w-full bg-background-800" />
			</div>
		{/if}

		<div class="h-8 flex w-full">
			<div class="h-full" style="width: {redSectionLength}%">
				<div class="flex items-center justify-center bg-error-600 bg-opacity-50 h-full w-full">PP smack</div>
			</div>

			<div class="h-full" style="width: {orangeSectionLength}%">
				<div class="flex items-center justify-center bg-orange-500 bg-opacity-60 h-full w-full">Not great</div>
			</div>

			<div class="h-full" style="width: {blueSectionLength}%">
				<div class="flex items-center justify-center bg-slate-700 h-full w-full">We're good</div>
			</div>

			<div class="h-full" style="width: {greenSectionLength}%">
				<div class="flex items-center justify-center bg-green-600 bg-opacity-60 h-full w-full">The goal</div>
			</div>
		</div>

		<!-- <div class="relative w-full">
			<div class="flex flex-col items-center absolute" style="left: calc({redSectionLength}% - 57px)">
				<div>^</div>
				<div class="-mt-3">We're in trouble</div>
			</div>

			<div class="flex flex-col items-center absolute" style="left: calc({redSectionLength + orangeSectionLength}% - 48px)">
				<div>^</div>
				<div class="-mt-3">Mininum goal</div>
			</div>

			<div
				class="flex flex-col items-center absolute"
				style="left: calc({redSectionLength + orangeSectionLength + blueSectionLength}% - 63px)"
			>
				<div>^</div>
				<div class="-mt-3">We're showing off</div>
			</div>
		</div> -->
	</div>
</div>
