<script lang="ts">
	import moment from 'moment';
	import debounce from 'lodash/debounce';
	import { toast } from 'svelte-sonner';

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
	const {
		getAllBuybackRequests,
		getAllItemEntries,
		completeBuybackRequest,
		rejectBuybackRequest,
		cancelBuybackRequest,
		getState,
		getUpdatedAtDate
	} = useBuybacks();

	import { useSearch } from '$lib/models/useSearch';
	const { getItemsByMarketGroup, getItemMarketGroup } = useSearch();

	import { API_ROUTES } from '$lib/models/useConstants';
	import { useApi } from '$lib/models/useApi';
	const { apiCall } = useApi();

	let allBuybacks = [];
	let allItemEntries = [];
	let filteredItemEntries = [];

	let newItemPercentage = 90;
	let newItemSelection = null;
	let existingItemSearch = '';

	onMount(async () => {
		updateData();
	});

	const updateData = debounce(async () => {
		allBuybacks = await getAllBuybackRequests();
		allItemEntries = await getAllItemEntries();
		filteredItemEntries = allItemEntries;
	}, 100);

	const onChangeState = async (event, buyback) => {
		if (event.value === BUYBACK_STATES.pending) {
			return;
		} else if (event.value === BUYBACK_STATES.completed) {
			await completeBuybackRequest(buyback.id);
		} else if (event.value === BUYBACK_STATES.rejected) {
			await rejectBuybackRequest(buyback.id);
		} else if (event.value === BUYBACK_STATES.canceled) {
			await cancelBuybackRequest(buyback.id);
		}

		updateData();
	};

	const onNewItemEntry = async () => {
		if (newItemSelection) {
			if (newItemSelection.type === SEARCH_TYPES.ITEM) {
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

	const onCopyBuybackID = (buyback) => {
		navigator.clipboard.writeText(buyback.contract_id);
		toast.success('Contract ID copied to clipboard.');
	};

	const onCopyBuybackPrice = (buyback) => {
		navigator.clipboard.writeText(buyback.price_capture);
		toast.success('Price copied to clipboard.');
	};

	const doFilter = debounce(() => {
		if (existingItemSearch) {
			filteredItemEntries = allItemEntries.filter((item) => {
				let matchesName = item.name.toLowerCase().includes(existingItemSearch.toLowerCase());
				let matchesMarketGroup = getItemMarketGroup(item.eve_type_id)
					.name.toLowerCase()
					.includes(existingItemSearch.toLowerCase());
				return matchesName || matchesMarketGroup;
			});
		} else {
			filteredItemEntries = allItemEntries;
		}
	}, 300);

	$: {
		existingItemSearch;
		doFilter();
	}
</script>

<div class="flex flex-col p-3 overflow-y-auto h-full">
	<div class="flex items-center gap-3 text-3xl">
		Buyback System Admin View
		<Button on:click={() => safeGoto(WEB_ROUTES.buyback)} class="text-xl">
			Switch to member view
		</Button>
	</div>

	<div class="flex flex-wrap gap-5 2xl:overflow-hidden">
		<div class="flex flex-col lg:h-full max-2xl:max-h-96">
			<div class="flex items-center justify-between bg-black px-2 mt-5 h-12">
				<div class="text-xl">Admin List (All Buyback Requests)</div>
			</div>

			<div
				class="grid max-xl:grid-cols-[88px,90px,80px,1fr,90px] xl:grid-cols-[320px,1fr,100px,190px,140px] bg-background-900"
			>
				<div class="lg:ml-4 max-lg:ml-2">Contract ID</div>
				<div class="ml-4">Price</div>
				<!-- <div class="px-2"># Items</div> -->
				<div class="px-2">Status</div>
				<div class="px-2">Last Updated</div>
				<div class="flex justify-end px-2">Actions</div>
			</div>

			<div class="overflow-y-auto overflow-x-hidden">
				{#each allBuybacks as buyback}
					<div
						class="grid max-xl:text-sm max-xl:grid-cols-[88px,90px,80px,1fr,90px] xl:grid-cols-[320px,1fr,100px,190px,140px] items-center even:bg-background-700 odd:bg-background-800 py-2"
					>
						<div class="xl:px-2">
							<Button
								on:click={() => onCopyBuybackID(buyback)}
								variant="ghost"
								class="flex items-center justify-start gap-2 text-sm px-2 py-0 hover:bg-background-900 hover:text-background-50 w-full"
							>
								<span class="truncate">{buyback.contract_id}</span>
								<i class="far fa-copy" />
							</Button>
						</div>
						<div class="xl:px-2 max-xl:pl-2">
							<Button
								on:click={() => onCopyBuybackPrice(buyback)}
								variant="ghost"
								class="flex items-center justify-start gap-2 text-sm px-2 py-0 hover:bg-background-900 hover:text-background-50 w-full"
							>
								<span class="truncate">{buyback.price_capture.toLocaleString()} ISK</span>
								<i class="far fa-copy" />
							</Button>
						</div>
						<!-- <div class="px-2">{buyback.items.length}</div> -->
						<div class="px-2 capitalize">{getState(buyback)}</div>
						<div class="px-2">
							{moment(getUpdatedAtDate(buyback)).format('Do MMM YYYY, h:mm a')}
						</div>
						<div class="flex justify-end px-2">
							<Select.Root
								selected={{ value: getState(buyback), label: getState(buyback) }}
								onSelectedChange={(event) => onChangeState(event, buyback)}
							>
								<Select.Trigger
									class="bg-primary-600 text-white border-0 max-xl:px-2 max-xl:text-xs xl:text-lg hover:bg-primary-900 capitalize w-32"
								>
									<Select.Value placeholder="State" />
								</Select.Trigger>
								<Select.Content>
									<!-- <Select.Item value={BUYBACK_STATES.pending}>Pending</Select.Item> -->
									<Select.Item value={BUYBACK_STATES.completed}>Completed</Select.Item>
									<Select.Item value={BUYBACK_STATES.rejected}>Rejected</Select.Item>
									<Select.Item value={BUYBACK_STATES.canceled}>Canceled</Select.Item>
								</Select.Content>
							</Select.Root>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="flex flex-col lg:h-full max-2xl:max-h-96">
			<div class="flex items-center justify-between bg-black px-2 mt-5 h-12">
				<div class="text-xl">Item Settings</div>
			</div>

			<div class="grid grid-cols-[80px,1fr,110px,100px] items-center bg-background-700 py-2">
				<div class="px-2 col-span-2">
					<SearchSelect
						placeholder="Item or Category"
						value={null}
						type={SEARCH_TYPES.ITEM_OR_MARKET_GROUP}
						on:selected={(value) => onChangeItemSelected(value)}
					/>
				</div>
				<div>
					<Input type="number" bind:value={newItemPercentage} step="0.01" class="w-20" />
				</div>
				<div class="flex justify-end px-2">
					<Button on:click={onNewItemEntry} class="text-lg" disabled={!newItemSelection}>
						Add Entry
					</Button>
				</div>
			</div>

			<div class="grid grid-cols-[80px,1fr,110px,100px] bg-background-900">
				<div class="px-2">Item ID</div>
				<div class="px-2">Item Name</div>
				<div class="pr-2">% We Pay</div>
				<div class="flex px-2 justify-end">Actions</div>
			</div>

			<Input
				bind:value={existingItemSearch}
				placeholder="Search for item"
				class="border-background-600 my-1 w-full"
			/>

			<div class="overflow-y-auto">
				{#each filteredItemEntries as item}
					<div
						class="grid grid-cols-[80px,1fr,110px,100px] items-center even:bg-background-800 odd:bg-background-700 py-2"
					>
						<div class="px-2">{item.eve_type_id}</div>
						<div class="px-2 max-w-60">
							{item.name} ({getItemMarketGroup(item.eve_type_id).name})
						</div>
						<div class="relative px-2">
							<Input
								type="number"
								bind:value={item.percentage}
								step="0.01"
								max="100"
								class="w-20"
								on:input={() => onEntryPercentageInput(item)}
							/>
							<div class="text-xl absolute" style="right: 4px; top: 3px">%</div>
						</div>
						<div class="flex justify-end px-2">
							<Button on:click={() => onDeleteItemEntry(item)} class="text-lg">Delete</Button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
