<script lang="ts">
	import { onMount } from 'svelte';
	import moment from 'moment';

	import { usePapService } from '@/models/usePapService';
	const { getCorporationPaps } = usePapService();

	let leaderboard = [];

	// the date range should be from sunday to saturday of the current week
	const startDate = moment.utc().startOf('week').toISOString();
	const endDate = moment.utc().endOf('week').toISOString();

	onMount(async () => {
		leaderboard = await getCorporationPaps(98718341, startDate, endDate, 10);
	});
</script>

{#if leaderboard}
	<div class="flex flex-col flex-grow items-start gap-1 w-fit bg-background-900 shadow-sm shadow-black">
		<div class="flex text-xl bg-black px-3 py-1 w-full">
			Weekly PAP Leaders ({moment.utc(startDate).format('MMM Do')} - {moment.utc(endDate).format('MMM Do')})
		</div>

		<div class="flex flex-col flex-grow gap-1 w-full">
			{#each leaderboard as contributor}
				<div class="grid grid-cols-2 items-center gap-3 px-3 even:bg-background-800 odd:bg-background-700 !bg-opacity-50">
					<div class="text-left text-base">{contributor.name}</div>
					<div class="text-right text-base">+{contributor.totalStrategic} PAPs</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
