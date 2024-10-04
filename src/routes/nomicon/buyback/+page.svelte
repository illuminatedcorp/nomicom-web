<script lang="ts">
	import { onMount } from 'svelte';
	import moment from 'moment';

	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';

	import { userStore } from '@/stores/userStore';
	import { BUYBACK_STATES, WEB_ROUTES } from '$lib/models/useConstants';
	// import { useApi } from '$lib/models/useApi';
	// const { apiCall } = useApi();

	import { useAuth } from '@/models/useAuth';
	const { safeGoto, hasAccessToRoute } = useAuth();

	import { useBuybacks } from '@/models/useBuybacks';
	const { createBuybackRequest, getAllItemEntries } = useBuybacks();

	let pasteText = '';
	let buybacks = [];
	let parsedData = [];
	let allItemEntries = [];
	let hasInvalidItems = false;

	onMount(async () => {
		userStore.subscribe(async (data) => {
			updateBuybacks();
		});

		allItemEntries = await getAllItemEntries();
	});

	const updateBuybacks = async () => {
		// let data = await get(userStore);
		// if (data.id) {
		// 	// buybacks = await apiCall(API_ROUTES.buybacksByUser, { id: data.id });
		// }
	};

	const onCancel = (buyback) => async () => {
		// await apiCall(API_ROUTES.saveBuyback, {
		// 	id: buyback.id,
		// 	state: BUYBACK_STATES.canceled
		// });

		updateBuybacks();
	};

	const onSubmitText = async () => {
		const regex = /^(.*?)\t(\d+)/gm;
		let matches = pasteText.matchAll(regex);
		let items = [];
		for (const match of matches) {
			items.push({ item_name: match[1], quantity: parseInt(match[2]) });
		}

		parsedData = items;
	};

	const onSubmitBuyback = async () => {
		await createBuybackRequest(parsedData);
	};

	const isValidItem = (item) => {
		return allItemEntries.find((entry) => entry.name === item.item_name);
	};

	$: {
		hasInvalidItems = parsedData.some((item) => !isValidItem(item));
	}
</script>

<div class="flex flex-col p-3 overflow-y-auto h-full">
	<div class="flex items-center gap-3 text-3xl">
		Buyback System
		{#if hasAccessToRoute(WEB_ROUTES.buybackAdmin)}
			<Button on:click={() => safeGoto(WEB_ROUTES.buybackAdmin)} class="text-xl">Admin view</Button>
		{/if}
	</div>
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
							class="grid grid-cols-[1fr,100px] text-sm even:bg-background-800 odd:bg-background-700 px-2 py-1 {isValidItem(
								item
							)
								? ''
								: 'even:bg-red-800 odd:bg-red-700 text-red-50'}"
						>
							<div>{item.item_name}</div>
							<div class="text-right pr-2">{item.quantity}</div>
						</div>
					{/each}
				</div>

				{#if hasInvalidItems}
					<div class="text-red-50 mt-1">We do not buyback the items marked in red.</div>
				{/if}

				<Button on:click={onSubmitBuyback} class="text-xl mt-2" disabled={hasInvalidItems}>
					{#if hasInvalidItems}
						Invalid Items
					{:else}
						Submit Buyback Request
					{/if}
				</Button>
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

		<div class="flex flex-col bg-background-800">
			<div class="text-xl bg-black px-2 py-1">Instructions</div>
			<div class="flex flex-col px-2">
				<div>1. Paste your inventory information to the left.</div>
				<div>2. Click "Parse Pasted Data" to see the results.</div>
				<div>3. Review the items and click "Submit Buyback Request".</div>
				<div>4. Set up the contract in-game.</div>
				<div class="ml-3">!! Assign your contract to our corporation "Illuminated"</div>
				<div class="ml-3">
					!! Your contract description must have the "Contract ID" from the list below.
				</div>
				<div class="ml-3">!! Make sure the price for the contract is correct.</div>
				<div>5. Click "Cancel" if you need to cancel a buyback request.</div>
			</div>
		</div>
	</div>

	<div>
		<div class="flex flex-col">
			<div class="flex items-center justify-between bg-black px-2 mt-5 h-12">
				<div class="text-xl">Your Buyback Requests</div>
			</div>

			<div class="buyback-grid bg-background-900">
				<div class="px-2">Contract ID</div>
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
	</div>
</div>

<style>
	.buyback-grid {
		display: grid;
		grid-template-columns: 120px 1fr 80px 100px 1fr 150px;
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
