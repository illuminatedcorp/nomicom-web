<script lang="ts">
	import moment from 'moment';
	import debounce from 'lodash/debounce';

	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import SearchSelect from '@/components/ui/SearchSelect.svelte';

	import { BUYBACK_STATES, WEB_ROUTES } from '$lib/models/useConstants';
	import { SEARCH_TYPES } from '$lib/models/useSearch';

	import { useAuth } from '@/models/useAuth';
	import { onMount } from 'svelte';
	const { safeGoto } = useAuth();

	import { useBuybacks } from '@/models/useBuybacks';
	const { getAllBuybackRequests, getAllItemEntries } = useBuybacks();

	import { useSearch } from '$lib/models/useSearch';
	const { getItemsByMarketGroup } = useSearch();

	import { API_ROUTES } from '$lib/models/useConstants';
	import { useApi } from '$lib/models/useApi';
	const { apiCall } = useApi();

	let allBuybacks = [];
	let allItemEntries = [];

	let newItemPercentage = 0.9;
	let newItemSelection = null;

	onMount(async () => {
		allBuybacks = await getAllBuybackRequests();
		allItemEntries = await getAllItemEntries();
	});

	const updateData = async () => {
		allBuybacks = await getAllBuybackRequests();
		allItemEntries = await getAllItemEntries();
	};

	const onChangeState = async (event, buyback) => {
		// await apiCall(API_ROUTES.saveBuyback, {
		// 	id: buyback.id,
		// 	state: event.value
		// });

		updateData();
	};

	const onNewItemEntry = async () => {
		if (newItemSelection) {
			if (newItemSelection.type === SEARCH_TYPES.ITEM) {
				console.log(newItemSelection);
				await apiCall(API_ROUTES.createBuybackItem, {
					eve_type_id: newItemSelection.id,
					name: newItemSelection.name,
					percentage: newItemPercentage
				});
			} else if (newItemSelection.type === SEARCH_TYPES.MARKET_GROUP) {
				// if we are dealing with a market group then we want to get all items in that group and add entries for them all
				const items = await getItemsByMarketGroup(newItemSelection.id);
				for (const item of items) {
					await apiCall(API_ROUTES.createBuybackItem, {
						eve_type_id: item.itemTypeID,
						name: item.name,
						percentage: newItemPercentage
					});
				}
			}
		}

		updateData();
	};

	const onChangeItemSelected = async (event) => {
		newItemSelection = event.detail;
	};

	const onDeleteItemEntry = async (item) => {
		await apiCall(API_ROUTES.deleteBuybackItem, {
			id: item.id
		});

		updateData();
	};

	const onEntryPercentageInput = debounce(async (item) => {
		await apiCall(API_ROUTES.updateBuybackItem, {
			id: item.id,
			percentage: item.percentage
		});
	}, 300);
</script>

<div class="flex flex-col p-3 overflow-y-auto h-full">
	<div class="flex items-center gap-3 text-3xl">
		Buyback System Admin View
		<Button on:click={() => safeGoto(WEB_ROUTES.buyback)} class="text-xl">Personal view</Button>
	</div>

	<div class="flex flex-wrap gap-3">
		<div class="flex flex-col flex-grow">
			<div class="flex items-center justify-between bg-black px-2 mt-5 h-12">
				<div class="text-xl">Admin List (All Buyback Requests)</div>
			</div>

			<div class="buyback-grid bg-background-900">
				<div class="px-2">Buyback ID</div>
				<div class="px-2">Price</div>
				<div class="px-2"># Items</div>
				<div class="px-2">Status</div>
				<div class="px-2">Date</div>
				<div class="flex px-2 justify-end">Actions</div>
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

		<div class="flex flex-col">
			<div class="flex items-center justify-between bg-black px-2 mt-5 h-12">
				<div class="text-xl">Item Settings</div>
			</div>

			<div class="grid grid-cols-4 items-center bg-background-700 py-2">
				<div class="px-2 col-span-2">
					<SearchSelect
						placeholder="Item or Category"
						value={null}
						type={SEARCH_TYPES.ITEM_OR_MARKET_GROUP}
						on:selected={(value) => onChangeItemSelected(value)}
					/>
				</div>
				<div class="px-2">
					<Input type="number" bind:value={newItemPercentage} step="0.01" class="w-20" />
				</div>
				<div class="flex justify-end px-2">
					<Button on:click={onNewItemEntry} class="text-lg" disabled={!newItemSelection}>
						Add Entry
					</Button>
				</div>
			</div>

			<div class="grid grid-cols-4 bg-background-900">
				<div class="px-2">Item ID</div>
				<div class="px-2">Item Name</div>
				<div class="px-2">Price % We Pay</div>
				<div class="flex px-2 justify-end">Actions</div>
			</div>

			{#each allItemEntries as item}
				<div
					class="grid grid-cols-4 items-center even:bg-background-800 odd:bg-background-700 py-2"
				>
					<div class="px-2">{item.eve_type_id}</div>
					<div class="px-2">{item.name}</div>
					<div class="px-2">
						<Input
							type="number"
							bind:value={item.percentage}
							step="0.01"
							class="w-20"
							on:input={() => onEntryPercentageInput(item)}
						/>
					</div>
					<div class="flex justify-end px-2">
						<Button on:click={() => onDeleteItemEntry(item)} class="text-lg">Delete</Button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.buyback-grid {
		display: grid;
		grid-template-columns: 110px 1fr 80px 100px 1fr 150px;
	}
</style>
