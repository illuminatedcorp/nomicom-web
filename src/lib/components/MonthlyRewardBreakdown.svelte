<script lang="ts">
	import { onMount } from 'svelte';
	import moment from 'moment';

	import { Skeleton } from '$lib/components/ui/skeleton';

	import { usePapService } from '@/models/usePapService';
	const { getCharacterPapMetrics, getCorporationPaps } = usePapService();

	import { startRandomizing } from '$lib/components/utilities';

	export let characterIds;

	const currentPoolAmount = 8000000000; // 8 billion
	const minimumPaps = 8;

	let potentialIskReward = null;
	let rewardPercentage = 0;
	let iskReward = 0;
	let userPaps = 0;

	let papMetrics = null;
	let corpPaps = null;

	let randomTextElements = [];

	const previewMode = true;

	onMount(async () => {
		if (previewMode) {
			for (let randomTextElement of randomTextElements) {
				// we pause for a moment before starting the randomization to space them out
				await new Promise((resolve) => setTimeout(resolve, 100));
				startRandomizing(randomTextElement, 500);
			}
		} else {
			updatePapMetrics();
			updateCorpPaps();
		}
	});

	const updatePapMetrics = async () => {
		papMetrics = await getCharacterPapMetrics(characterIds);
	};

	const updateCorpPaps = async () => {
		const startDate = moment.utc().startOf('month').toISOString();
		const endDate = moment.utc().endOf('month').toISOString();

		corpPaps = await getCorporationPaps(98718341, startDate, endDate, null, true);
	};

	const calculateReward = () => {
		// First we want to sum up the total number of strategic PAPs above the minimum
		let totalPaps = 0;
		corpPaps.forEach((contributor) => {
			if (contributor.totalStrategic > minimumPaps) {
				totalPaps += contributor.totalStrategic - minimumPaps;
			}
		});

		// Then we calculate the percentage of the total pool that the current user will receive
		userPaps = 0; //papMetrics.monthlyTotals[moment.utc().format('MM/YYYY')]?.totalStrategic || 0;

		if (userPaps > minimumPaps) {
			rewardPercentage = ((userPaps - minimumPaps) / totalPaps) * 100;
			iskReward = (rewardPercentage / 100) * currentPoolAmount;
		} else {
			rewardPercentage = 0;
			iskReward = 0;
		}
	};

	const calculatePotentialReward = () => {
		if (userPaps < minimumPaps) {
			// we want to calculate the value of 1 PAP if it was added to the current total
			let totalPaps = 0;
			corpPaps.forEach((contributor) => {
				if (contributor.totalStrategic > minimumPaps) {
					totalPaps += contributor.totalStrategic - minimumPaps;
				}
			});

			totalPaps += 1;

			const potentialRewardPercentage = (1 / totalPaps) * 100;
			potentialIskReward = (potentialRewardPercentage / 100) * currentPoolAmount;
		}
	};

	$: {
		if (corpPaps && papMetrics) {
			calculateReward();
			calculatePotentialReward();
		}
	}
</script>

{#if previewMode}
	<div class="flex flex-col items-start gap-1 w-fit min-w-[430px] bg-background-900 shadow-sm shadow-black">
		<div bind:this={randomTextElements[0]} class="flex text-xl bg-black px-3 py-1 w-full triglavian">tlhynMo ewrRda kdBrenowa</div>

		<div class="flex flex-col flex-grow gap-1 w-full">
			<div class="flex flex-col items-center py-1 px-3 bg-primary-800 bg-opacity-50">
				<div bind:this={randomTextElements[1]} class="text-xl triglavian">erdawR Polo</div>
				<div bind:this={randomTextElements[2]} class="text-3xl triglavian">{currentPoolAmount.toLocaleString()} SIK</div>
			</div>

			<div class="flex flex-col justify-center items-center py-1 px-3 bg-slate-800">
				<div bind:this={randomTextElements[3]} class="text-2xl triglavian">uYo aehv <span class="text-error-500">0</span> osubn PPsA</div>
			</div>

			<div class="flex flex-col flex-grow justify-center items-center py-1 px-3 bg-background-800">
				<div bind:this={randomTextElements[4]} class="text-xl triglavian">fI ouy gto <span class="text-green-500">+??</span> sAPP,</div>
				<div bind:this={randomTextElements[5]} class="text-xl triglavian">ryuo rrwead ouwld eb</div>

				<div bind:this={randomTextElements[6]} class="text-3xl text-green-500 triglavian">??,???,??? KIS</div>
			</div>
		</div>
	</div>
{:else}
	<div class="flex flex-col items-start gap-1 w-fit bg-background-900 shadow-sm shadow-black">
		<div class="flex text-xl bg-black px-3 py-1 w-full">Monthly Reward Breakdown</div>

		<div class="flex flex-col flex-grow gap-1 w-full">
			<div class="flex flex-col items-center py-1 px-3 bg-primary-800 bg-opacity-50">
				<div class="text-xl">Reward Pool</div>
				<div class="text-3xl">{currentPoolAmount.toLocaleString()} ISK</div>
			</div>

			{#if userPaps < minimumPaps}
				<div class="flex flex-col justify-center items-center py-1 px-3 bg-slate-800">
					<div class="text-2xl">You have <span class="text-error-500">0</span> bonus PAPs</div>
				</div>

				<div class="flex flex-col flex-grow justify-center items-center py-1 px-3 bg-background-800">
					<div class="text-xl">If you got <span class="text-green-500">+{minimumPaps - userPaps}</span> PAPs,</div>
					<div class="text-xl">your reward would be</div>

					{#if potentialIskReward !== null}
						<div class="text-3xl text-green-500">
							{potentialIskReward.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							})} ISK
						</div>
					{:else}
						<Skeleton class="h-8 w-full mt-1 rounded-sm bg-background-300" />
					{/if}
				</div>
			{:else}
				<div class="flex flex-col items-center py-1 px-3 bg-slate-800">
					<div class="text-xl">You have gotten</div>
					<div class="text-3xl">
						<span class="text-green-500">+{userPaps - minimumPaps}</span> bonus PAPs
					</div>
					<div class="text-base">
						({rewardPercentage.toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}% of all bonus PAPs this month)
					</div>
				</div>

				<div class="flex flex-col flex-grow items-center py-2 px-3 bg-green-800 bg-opacity-50">
					<div class="text-xl">Your reward is</div>
					<div class="text-3xl">
						{iskReward.toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})} ISK
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
