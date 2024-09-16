<script lang="ts">
	import { get } from 'svelte/store';

	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';

	import { sessionStore } from '$lib/stores/sessionStore';

	import { API_ROUTES, BUYBACK_STATES } from '$lib/models/useConstants';
	import { useApi } from '$lib/models/useApi';
	const { apiGet } = useApi();

	let buybackId = '';
	let pasteText = '';
	let appraisalData = [
		{
			name: 'Mid-grade Asklepian Alpha',
			quantity: '1',
			id: '42204',
			appraisal: {
				buy: {
					weightedAverage: '32732430.93922652',
					max: '41880000.0',
					min: '20000000.0',
					stddev: '5866035.48687982',
					median: '39880000.0',
					volume: '181.0',
					orderCount: '25',
					percentile: '41838839.77900552'
				},
				sell: {
					weightedAverage: '53952105.2631579',
					max: '65160000.0',
					min: '49960000.0',
					stddev: '6597470.727483374',
					median: '50000000.0',
					volume: '19.0',
					orderCount: '5',
					percentile: '49960000.0'
				}
			}
		},
		{
			name: 'Mid-grade Asklepian Beta',
			quantity: '1',
			id: '42205',
			appraisal: {
				buy: {
					weightedAverage: '48015000.0',
					max: '53160000.0',
					min: '44130000.0',
					stddev: '2879756.624141306',
					median: '50785000.0',
					volume: '42.0',
					orderCount: '8',
					percentile: '53056190.47619048'
				},
				sell: {
					weightedAverage: '66306153.84615385',
					max: '75000000.0',
					min: '59320000.0',
					stddev: '5322275.471119119',
					median: '62040000.0',
					volume: '39.0',
					orderCount: '21',
					percentile: '59324871.7948718'
				}
			}
		},
		{
			name: 'Mid-grade Asklepian Delta',
			quantity: '1',
			id: '42207',
			appraisal: {
				buy: {
					weightedAverage: '105682857.14285715',
					max: '117900000.0',
					min: '72150000.0',
					stddev: '19065830.69262916',
					median: '114200000.0',
					volume: '14.0',
					orderCount: '9',
					percentile: '117900000.00000001'
				},
				sell: {
					weightedAverage: '139495833.33333334',
					max: '170100000.0',
					min: '126100000.0',
					stddev: '12864699.763305798',
					median: '130150000.0',
					volume: '48.0',
					orderCount: '20',
					percentile: '126116666.66666667'
				}
			}
		},
		{
			name: 'Mid-grade Asklepian Epsilon',
			quantity: '1',
			id: '42208',
			appraisal: {
				buy: {
					weightedAverage: '187733333.33333334',
					max: '195300000.0',
					min: '100000.0',
					stddev: '89375795.08829305',
					median: '193700000.0',
					volume: '9.0',
					orderCount: '11',
					percentile: '195300000.0'
				},
				sell: {
					weightedAverage: '244056000.0',
					max: '516800000.0',
					min: '213300000.0',
					stddev: '76246947.97841677',
					median: '220000000.0',
					volume: '50.0',
					orderCount: '19',
					percentile: '213300000.0'
				}
			}
		},
		{
			name: 'Mid-grade Asklepian Gamma',
			quantity: '1',
			id: '42206',
			appraisal: {
				buy: {
					weightedAverage: '73122500.0',
					max: '75060000.0',
					min: '67000000.0',
					stddev: '2526589.6693256013',
					median: '72750000.0',
					volume: '20.0',
					orderCount: '8',
					percentile: '75060000.0'
				},
				sell: {
					weightedAverage: '92632500.0',
					max: '110000000.0',
					min: '79930000.0',
					stddev: '6619054.957328773',
					median: '88595000.0',
					volume: '56.0',
					orderCount: '22',
					percentile: '79930000.0'
				}
			}
		},
		{
			name: 'Mid-grade Asklepian Omega',
			quantity: '1',
			id: '42209',
			appraisal: {
				buy: {
					weightedAverage: '316635714.28571427',
					max: '406000000.0',
					min: '150000000.0',
					stddev: '79887170.43430692',
					median: '386500000.0',
					volume: '14.0',
					orderCount: '9',
					percentile: '406000000.0'
				},
				sell: {
					weightedAverage: '432032142.85714287',
					max: '440000000.0',
					min: '422200000.0',
					stddev: '7311093.482652761',
					median: '429500000.0',
					volume: '28.0',
					orderCount: '14',
					percentile: '422200000.0'
				}
			}
		}
	];

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
		appraisalData = await apiGet(API_ROUTES.getAppraisal, items);

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

		let response = await apiGet(API_ROUTES.saveBuyback, {
			userId: sessionData.id,
			contractId: buybackId,
			items: appraisalData,
			total: getTotalPrice(),
			state: BUYBACK_STATES.pending
		});

		if (response.status === 'ok') {
			// redirect to the main page
			window.location.href = '/buyback';
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
