<script lang="ts">
	import { onMount } from 'svelte';
	import moment from 'moment';

	import { useBirdhouse } from '@/models/useBirdhouse';

	const { getCorporationEventMetrics } = useBirdhouse();

	let week = Math.ceil(moment.utc().date() / 7);
	let eventLeaderboard = [];

	onMount(async () => {
		eventLeaderboard = await getCorporationEventMetrics(98718341);
	});
</script>

<div class="flex flex-col flex-grow items-start gap-2 mt-3 w-fit shadow-sm shadow-black">
	<div class="flex text-xl bg-black px-3 py-1 w-full">
		Event Leaderboard (Week #{week}, {moment
			.utc()
			.month(moment.utc().month())
			.date((week - 1) * 7 + 1)
			.startOf('day')
			.format('Do')} - {moment
			.utc()
			.month(moment.utc().month())
			.date((week - 1) * 7 + 7)
			.endOf('day')
			.format('Do')})
	</div>

	<div class="flex flex-col flex-grow gap-1 w-full">
		{#each eventLeaderboard as contributor}
			<div
				class="grid grid-cols-2 items-center gap-3 px-3 even:bg-background-800 odd:bg-background-900"
			>
				<div class="text-left text-lg">{contributor.name}</div>
				<div class="text-right text-lg">{contributor.totalStrategic} PAPs</div>
			</div>
		{/each}
	</div>
</div>
