<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { base } from '$app/paths';
	import moment from 'moment';

	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';

	import { sessionStore } from '$lib/stores/sessionStore';
	import { API_ROUTES, BUYBACK_STATES } from '$lib/models/useConstants';
	// import { useApi } from '$lib/models/useApi';
	// const { apiCall } = useApi();

	// so on this main page we want to display the user's buyback requests
	// we'll need to see
	// the price of the buyback
	// the items in the buyback, prolly in a dropdown or something
	// the status of the buyback
	// the date of the buyback
	// the ID of the buyback

	// we'll also need to be able to cancel buybacks
	// possible buyback states are
	// pending
	// denied
	// completed
	// cancelled

	// we'll want nav to
	// request a buyback
	// view buyback requests
	// view admin page ONLY IF ADMIN

	// we could also display some metrics over time for admins?

	let buybacks = [];
	let allBuybacks = [];
	let sessionData = get(sessionStore);

	onMount(async () => {
		sessionStore.subscribe(async (session) => {
			sessionData = await session;
			updateBuybacks();
		});
	});

	const updateBuybacks = async () => {
		let data = await get(sessionStore);
		if (data.id) {
			// buybacks = await apiCall(API_ROUTES.buybacksByUser, { id: data.id });
		}

		if (data.admin) {
			// get admin metrics
			// allBuybacks = await apiCall(API_ROUTES.allBuybacks);
		}
	};

	const onCancel = (buyback) => async () => {
		// await apiCall(API_ROUTES.saveBuyback, {
		// 	id: buyback.id,
		// 	state: BUYBACK_STATES.canceled
		// });

		updateBuybacks();
	};

	const onChangeState = async (event, buyback) => {
		// await apiCall(API_ROUTES.saveBuyback, {
		// 	id: buyback.id,
		// 	state: event.value
		// });

		updateBuybacks();
	};
</script>

<div class="flex items-center flex-col px-2 py-1">
	<div class="text-3xl">Buyback System</div>
	<div>If you encounter a bug or issue with this system, open an admin ticket on Discord.</div>

	<div class="flex flex-wrap gap-4">
		<div class="flex flex-col">
			<div class="flex items-center justify-between bg-background-900 px-2 mt-5 h-12">
				<div class="text-xl">Your Buyback Requests</div>
				<Button href="{base}/portal/buyback/request">Request Buyback</Button>
			</div>

			<div class="buyback-grid bg-primary-900">
				<div class="px-2">Buyback ID</div>
				<div class="px-2">Price</div>
				<div class="px-2"># Items</div>
				<div class="px-2">Status</div>
				<div class="px-2">Date</div>
				<div class="px-2">Actions</div>
			</div>

			{#each buybacks as buyback}
				<div class="buyback-grid even:bg-background-700 odd:bg-background-600 py-2">
					<div class="px-2">{buyback.contract_id}</div>
					<div class="px-2">{buyback.total_price.toLocaleString()} ISK</div>
					<div class="px-2">{buyback.items.length}</div>
					<div class="px-2 capitalize">{buyback.state}</div>
					<div class="px-2">{moment(buyback.created_at).format('Do MMM YYYY, h:mm a')}</div>
					<div class="px-2">
						<Button
							disabled={buyback.state === BUYBACK_STATES.canceled}
							on:click={onCancel(buyback)}
						>
							Cancel
						</Button>
					</div>
				</div>
			{/each}
		</div>

		{#if sessionData.admin}
			<div class="flex flex-col">
				<div class="flex items-center justify-between bg-background-900 px-2 mt-5 h-12">
					<div class="text-xl">Admin List (All Buyback Requests)</div>
				</div>

				<div class="buyback-grid bg-primary-900">
					<div class="px-2">Buyback ID</div>
					<div class="px-2">Price</div>
					<div class="px-2"># Items</div>
					<div class="px-2">Status</div>
					<div class="px-2">Date</div>
					<div class="px-2">Actions</div>
				</div>

				{#each allBuybacks as buyback}
					<div class="buyback-grid even:bg-background-700 odd:bg-background-600 py-2">
						<div class="px-2">{buyback.contract_id}</div>
						<div class="px-2">{buyback.total_price.toLocaleString()} ISK</div>
						<div class="px-2">{buyback.items.length}</div>
						<div class="px-2 capitalize">{buyback.state}</div>
						<div class="px-2">{moment(buyback.created_at).format('Do MMM YYYY, h:mm a')}</div>
						<div class="px-2">
							<Select.Root
								selected={{ value: buyback.state, label: buyback.state }}
								onSelectedChange={(event) => onChangeState(event, buyback)}
							>
								<Select.Trigger
									class="bg-primary-600 text-white border-0 text-lg hover:bg-primary-900 capitalize w-32"
								>
									<Select.Value placeholder="State" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value={BUYBACK_STATES.pending}>Pending</Select.Item>
									<Select.Item value={BUYBACK_STATES.completed}>Completed</Select.Item>
									<Select.Item value={BUYBACK_STATES.declined}>Declined</Select.Item>
									<Select.Item value={BUYBACK_STATES.canceled}>Canceled</Select.Item>
								</Select.Content>
							</Select.Root>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.buyback-grid {
		display: grid;
		grid-template-columns: 110px 1fr 80px 100px 1fr 150px;
	}
</style>
