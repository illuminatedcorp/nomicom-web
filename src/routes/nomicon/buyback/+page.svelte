<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { base } from '$app/paths';
	import moment from 'moment';

	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';

	import { userStore } from '@/stores/userStore';
	import { BUYBACK_STATES } from '$lib/models/useConstants';
	// import { useApi } from '$lib/models/useApi';
	// const { apiCall } = useApi();

	let pasteText = '';
	let buybacks = [];
	let allBuybacks = [];
	let userData = get(userStore);
	let parsedData = [];

	onMount(async () => {
		userStore.subscribe(async (data) => {
			userData = await data;
			updateBuybacks();
		});
	});

	const updateBuybacks = async () => {
		// let data = await get(userStore);
		// if (data.id) {
		// 	// buybacks = await apiCall(API_ROUTES.buybacksByUser, { id: data.id });
		// }
		// if (data.admin) {
		// 	// get admin metrics
		// 	// allBuybacks = await apiCall(API_ROUTES.allBuybacks);
		// }
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

	const onSubmitText = async () => {
		const regex = /^(.*?)\t(\d+)/gm;
		let matches = pasteText.matchAll(regex);
		let items = [];
		for (const match of matches) {
			items.push({ name: match[1], quantity: match[2] });
		}

		parsedData = items;
	};

	const onSubmitBuyback = async () => {};
</script>

<div class="flex flex-col p-3 overflow-y-auto h-full">
	<div class="text-3xl">Buyback System</div>
	<div>If you encounter a bug or issue with this system, open an admin ticket on Discord.</div>

	<div class="flex flex-wrap gap-4 mt-5">
		<div class="flex flex-col w-96">
			<div class="text-xl bg-black px-2 py-1">Paste your inventory data below</div>
			<Textarea
				bind:value={pasteText}
				placeholder="Paste your data here."
				class="bg-background-800 rounded-none border-0 h-64"
			/>

			<Button on:click={onSubmitText} class="text-xl mt-4">Parse Pasted Data</Button>
		</div>

		<div class="flex flex-col w-96 overflow-hidden">
			<div class="text-xl bg-black px-2 py-1">Parsing Results</div>
			{#if parsedData.length > 0}
				<div class="overflow-auto h-0 flex-grow">
					{#each parsedData as item}
						<div
							class="grid grid-cols-[1fr,100px] text-sm even:bg-background-800 odd:bg-background-700 px-2 py-1"
						>
							<div>{item.name}</div>
							<div class="text-right pr-2">{item.quantity}</div>
						</div>
					{/each}
				</div>

				<Button on:click={onSubmitBuyback} class="text-xl mt-4">Submit Buyback Request</Button>
			{:else}
				<div class="bg-background-800 px-2 py-1 h-full">
					Paste your inventory data into the box on the left and click "Parse Pasted Data".
					<br />
					<br />
					You can copy your inventory data from the game by clicking
					<span class="hotkey">Ctrl+A</span>, <span class="hotkey">Ctrl+C</span>, and then pasting
					it here with <span class="hotkey">Ctrl+V</span>.
				</div>
			{/if}
		</div>

		<div class="flex flex-col">
			<div class="text-xl bg-black px-2 py-1">Instructions</div>
			<div>Blah blah blah TODO</div>
		</div>
	</div>

	<div>
		<div class="flex flex-col">
			<div class="flex items-center justify-between bg-black px-2 mt-5 h-12">
				<div class="text-xl">Your Buyback Requests</div>
			</div>

			<div class="buyback-grid bg-background-900">
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

		{#if userData.admin}
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

	.hotkey {
		font-family: monospace;
		font-size: 1rem;
		padding: 0 0.25rem;
		border-radius: 0.25rem;
		color: var(--color-background-50);
		background-color: var(--color-primary-700);
	}
</style>
