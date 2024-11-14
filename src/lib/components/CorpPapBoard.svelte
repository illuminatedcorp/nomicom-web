<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';

	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Skeleton } from '$lib/components/ui/skeleton';

	import { usePapService } from '@/models/usePapService';
	const { getCorporationPaps } = usePapService();

	let corpPaps = null;

	onMount(async () => {
		// so we do a thing here. we want to spin off all of these requests at the same time
		// and have them complete independently of each other
		// so we can update the UI as they come in
		// so we make them all async functions and we do NOT await them. they await internally
		updateCorpPaps();
	});

	const updateCorpPaps = async () => {
		const startDate = moment.utc().startOf('month').toISOString();
		const endDate = moment.utc().endOf('month').toISOString();

		corpPaps = await getCorporationPaps(98718341, startDate, endDate, null, true);
	};
</script>

<div class="flex flex-col flex-grow items-start gap-1 w-fit bg-background-900 shadow-sm shadow-black">
	<div class="flex items-center justify-between gap-2 text-xl bg-black px-3 py-1 w-full">
		Corporation {moment.utc().format('MMMM')} PAP Board

		<Tooltip.Root openDelay={0}>
			<Tooltip.Trigger><i class="fas fa-question-circle text-base" /></Tooltip.Trigger>
			<Tooltip.Content class="bg-background-800">
				<div class="text-sm">
					<span class="text-green-500">+number over required 8 </span>
					<span class="text-background-400">(total number)</span>
					PAPs
				</div>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>

	<div class="flex flex-col flex-grow gap-1 w-full overflow-y-auto max-h-[276px]">
		{#if corpPaps === null}
			<div class="flex flex-col gap-1 w-full">
				{#each Array(10) as _}
					<Skeleton class="h-6 w-full rounded-sm even:bg-background-800 odd:bg-background-700" />
				{/each}
			</div>
		{:else if corpPaps.length === 0}
			<div class="flex text-center items-center justify-center p-3 w-full">
				Something broke. Go poke a Director in the #programming channel on Discord.
			</div>
		{:else}
			{#each corpPaps as contributor}
				<div class="flex items-center justify-between gap-3 px-3 even:bg-background-800 odd:bg-background-700 !bg-opacity-50">
					<div class="text-left text-base">{contributor.name}</div>
					<div class="text-right text-base">
						{#if contributor.totalStrategic > 8}
							<span class="text-green-500">+{contributor.totalStrategic - 8} </span>
						{/if}
						<span class="text-background-400">({contributor.totalStrategic})</span>
						PAPs
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
