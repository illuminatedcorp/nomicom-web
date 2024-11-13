<script lang="ts">
	import { onMount } from 'svelte';
	import moment from 'moment';
	import { toast } from 'svelte-sonner';
	import debounce from 'lodash/debounce';
	// import { get } from 'svelte/store';

	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';

	import { userStore } from '@/stores/userStore';
	import { BUYBACK_STATES, WEB_ROUTES } from '$lib/models/useConstants';

	import { useAuth } from '@/models/useAuth';
	const { safeGoto, hasAccessToRoute } = useAuth();

	import { useBuybacks } from '@/models/useBuybacks';
	const { createBuybackRequest, getAllItemEntries, getBuybackRequests, cancelBuybackRequest, getState, getUpdatedAtDate } = useBuybacks();

	let pasteText = '';
	let buybacks = [];
	let parsedData = [];
	let allItemEntries = [];
	let hasInvalidItems = false;

	onMount(async () => {
		userStore.subscribe(async () => {
			updateData();
		});

		updateData();
	});

	const updateData = debounce(async () => {
		let newBuybacks = await getBuybackRequests();
		buybacks = newBuybacks;
		// let userId = get(userStore);
		// console.log('userId', userId);
		// buybacks = newBuybacks.filter((buyback) => buyback.user_id === userId);
		allItemEntries = await getAllItemEntries();
	}, 100);

	const onCancel = (buyback) => async () => {
		await cancelBuybackRequest(buyback.id);
		updateData();
	};

	const onSubmitText = async () => {
		const regex = /^([\w -]*?)(?=\t| {2,}|\n|$| x)(?:\t| {4}|)?(\d+,?\.?\d*)?(?: x(\d+))?/gm;
		let matches = pasteText.matchAll(regex);

		let items = [];
		for (const match of matches) {
			items.push({ item_name: match[1], quantity: parseInt(match[2]) || parseInt(match[3]) || 1 });
		}

		if (items.length === 0) {
			toast.error('There was a problem with your data. Please check your format and try again.');
			return;
		}

		parsedData = items;
	};

	const onSubmitBuyback = async () => {
		await createBuybackRequest(parsedData);

		updateData();
		toast.success('Buyback request created.');
	};

	const isValidItem = (item) => {
		return allItemEntries.find((entry) => entry.name === item.item_name);
	};

	const onCopyBuybackID = (buyback) => {
		navigator.clipboard.writeText(buyback.contract_id);
		toast.success('Contract ID copied to clipboard.');
	};

	const onCopyBuybackPrice = (buyback) => {
		navigator.clipboard.writeText(buyback.price_capture);
		toast.success('Price copied to clipboard.');
	};

	$: {
		hasInvalidItems = parsedData.some((item) => !isValidItem(item));
	}
</script>

<div class="flex flex-col p-3 overflow-y-auto h-full">
	<div class="flex justify-between items-center gap-3 text-3xl">
		<div>Buyback System</div>
		{#if hasAccessToRoute(WEB_ROUTES.buybackAdmin)}
			<Button on:click={() => safeGoto(WEB_ROUTES.buybackAdmin)} class="text-base">Switch to admin view</Button>
		{/if}
	</div>
	<div>If you encounter a bug or issue with this system, open an admin ticket on Discord.</div>

	<div class="flex flex-wrap gap-4 mt-5">
		<div class="flex flex-col lg:w-96 max-lg:w-full">
			<div class="text-xl bg-black px-2 py-1">Paste your inventory data below</div>
			<Textarea
				bind:value={pasteText}
				placeholder="Paste your data here."
				class="bg-background-800 rounded-none border-0 lg:h-64 max-lg:h-32"
			/>

			<Button on:click={onSubmitText} class="text-xl mt-4">Parse Pasted Data</Button>
		</div>

		<div class="flex flex-col lg:w-96 max-lg:w-full overflow-hidden">
			<div class="text-xl bg-black px-2 py-1">Parsing Results</div>
			{#if parsedData.length > 0}
				<div class="overflow-auto max-lg:h-32 lg:h-0 flex-grow">
					{#each parsedData as item}
						<div
							class="grid grid-cols-[1fr,100px] text-sm even:bg-background-800 odd:bg-background-700 px-2 py-1 {isValidItem(item)
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
					<span class="hotkey">Ctrl+A</span>, <span class="hotkey">Ctrl+C</span>, and then pasting it here with
					<span class="hotkey">Ctrl+V</span>.
				</div>
			{/if}
		</div>

		<div class="flex flex-col bg-background-800">
			<div class="text-xl bg-black px-2 py-1">Instructions</div>
			<div class="flex flex-col px-2">
				<div>1. Paste your inventory information here.</div>
				<div>2. Click "Parse Pasted Data" to see the results.</div>
				<div>3. Review the items and click "Submit Buyback Request".</div>
				<div>4. Set up the contract in-game.</div>
				<div class="ml-3">• Assign your contract to our corporation "Illuminated".</div>
				<div class="ml-3">• Your contract description must have the "Contract ID" from the list below.</div>
				<div class="ml-3">• Make sure the price for the contract is correct.</div>
				<div>5. Click "Cancel" if you need to cancel a buyback request.</div>
			</div>
		</div>
	</div>

	<div>
		<div class="flex flex-col">
			<div class="flex items-center justify-between bg-black px-2 mt-5 h-12">
				<div class="text-xl">Your Buyback Requests</div>
			</div>

			<div class="grid grid-cols-[320px,1fr,190px,190px,100px,140px] bg-background-900">
				<div class="ml-4">Contract ID</div>
				<div class="ml-4">Price</div>
				<!-- <div class="px-2"># Items</div> -->
				<div class="px-2">Created At</div>
				<div class="px-2">Last Updated</div>
				<div class="px-2">Status</div>
				<div class="flex justify-end px-2">Actions</div>
			</div>

			{#each buybacks as buyback}
				<div
					class="grid text-sm grid-cols-[320px,1fr,190px,190px,100px,140px] items-center even:bg-background-700 odd:bg-background-800 py-2"
				>
					<div class="px-2">
						<Button
							on:click={() => onCopyBuybackID(buyback)}
							variant="ghost"
							class="flex items-center justify-start gap-2 text-sm px-2 py-0 hover:bg-background-900 hover:text-background-50 w-full"
						>
							<span class="truncate">{buyback.contract_id}</span>
							<i class="far fa-copy" />
						</Button>
					</div>
					<div class="px-2">
						<Button
							on:click={() => onCopyBuybackPrice(buyback)}
							variant="ghost"
							class="flex items-center justify-start gap-2 text-sm px-2 py-0 hover:bg-background-900 hover:text-background-50 w-full"
						>
							<span class="truncate">{buyback.price_capture.toLocaleString()} ISK</span>
							<i class="far fa-copy" />
						</Button>
					</div>
					<div class="px-2 text-sm">
						{moment(buyback.inserted_at).format('Do MMM YYYY, h:mm a')}
					</div>
					<div class="px-2 text-sm">
						{moment(getUpdatedAtDate(buyback)).format('Do MMM YYYY, h:mm a')}
					</div>
					<div class="px-2 text-sm capitalize">
						{#if getState(buyback) === BUYBACK_STATES.pending}
							<div class="bg-orange-700 px-2 py-1 rounded-sm">
								{getState(buyback)}
							</div>
						{:else if getState(buyback) === BUYBACK_STATES.completed}
							<div class="bg-green-800 px-2 py-1 rounded-sm">
								{getState(buyback)}
							</div>
						{:else if getState(buyback) === BUYBACK_STATES.rejected}
							<div class="bg-error-800 px-2 py-1 rounded-sm">
								{getState(buyback)}
							</div>
						{:else if getState(buyback) === BUYBACK_STATES.canceled}
							<div class="bg-background-600 px-2 py-1 rounded-sm">
								{getState(buyback)}
							</div>
						{/if}
					</div>
					<div class="flex justify-end px-2">
						<Button disabled={getState(buyback) === BUYBACK_STATES.canceled} on:click={onCancel(buyback)}>Cancel</Button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<div class="buyback-grid-small hidden"></div>

<style>
	.hotkey {
		font-family: monospace;
		font-size: 1rem;
		padding: 0 0.25rem;
		border-radius: 0.25rem;
		color: var(--color-background-50);
		background-color: var(--color-primary-700);
	}
</style>
