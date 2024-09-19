<script lang="ts">
	import { get } from 'svelte/store';

	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';

	import { sessionStore } from '$lib/stores/sessionStore';

	import { API_ROUTES, BUYBACK_STATES } from '$lib/models/useConstants';
	import { useApi } from '$lib/models/useApi';
	const { apiCall } = useApi();

	let buybackId = '';
	let pasteText = '';
	let appraisalData = [];

	const generateCustomId = () => {
		// Characters to use for the random part
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let randomPart = '';

		// Generate a 6-character random string
		for (let i = 0; i < 6; i++) {
			randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
		}

		// Return the final ID in the format 'IL-XXXXXX'
		return `IL-${randomPart}`;
	};

	const onSubmitText = async () => {
		const regex = /^(.*?)\t(\d+)/gm;
		let matches = pasteText.matchAll(regex);
		let items = [];
		for (const match of matches) {
			items.push({ name: match[1], quantity: match[2] });
		}

		// this injects the appraisal into the items + gets us their IDs
		appraisalData = await apiCall(API_ROUTES.getAppraisal, items);

		buybackId = generateCustomId();
	};

	const getItemPrice = (item) => {
		return parseFloat(item.appraisal.buy.weightedAverage);
	};

	const getTotalPrice = () => {
		let total = 0;
		for (const item of appraisalData) {
			total += getItemPrice(item) * item.quantity;
		}
		return total;
	};

	const onSubmitBuyback = async () => {
		let sessionData = await get(sessionStore);

		let response = await apiCall(API_ROUTES.saveBuyback, {
			userId: sessionData.id,
			contractId: buybackId,
			items: appraisalData,
			total: getTotalPrice(),
			state: BUYBACK_STATES.pending
		});

		if (response.status === 'ok') {
			// redirect to the main page
			window.location.href = '/portal/buyback';
		}
	};
</script>

<div class="flex items-center flex-col px-2 py-1">
	<div class="text-3xl">New Buyback Request</div>
	<div>If you encounter a bug or issue with this system, open an admin ticket on Discord.</div>

	<div class="flex gap-4 mt-5">
		<div class="flex flex-col w-1/3">
			<div class="text-xl">Text Data</div>
			<Textarea
				bind:value={pasteText}
				placeholder="Paste your data here."
				class="bg-background-900 h-64"
			/>

			<Button on:click={onSubmitText} class="mt-4">Submit Paste</Button>
		</div>

		<div class="flex flex-col w-1/2">
			<div class="text-xl">Prices Breakdown</div>
			{#if appraisalData.length > 0}
				<div class="grid grid-cols-3 bg-background-900 px-2 py-1">
					<div>Name</div>
					<div class="text-right pr-2">Quantity</div>
					<div class="text-right">Price</div>
				</div>

				{#each appraisalData as item}
					<div class="grid grid-cols-3 even:bg-primary-800 odd:bg-primary-700 px-2 py-1">
						<div>{item.name}</div>
						<div class="text-right pr-2">{item.quantity}x</div>
						<div class="text-right">
							{getItemPrice(item).toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							})} ISK
						</div>
					</div>
				{/each}

				<div class="grid grid-cols-3 bg-background-700 px-2 py-1">
					<div class="col-span-2">Total Price</div>
					<div class="text-right">
						{getTotalPrice().toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})} ISK
					</div>
				</div>

				<div class="flex justify-end">
					<Button on:click={onSubmitBuyback} class="mt-4">Submit Buyback Request</Button>
				</div>
			{/if}
		</div>

		<div class="flex flex-col w-1/6">
			<div class="text-xl">Instructions</div>
			<div>Blah blah blah TODO</div>
		</div>
	</div>
</div>
