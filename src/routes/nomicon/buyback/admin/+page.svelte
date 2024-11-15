<script lang="ts">
	import moment from 'moment';
	import debounce from 'lodash/debounce';
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import SearchSelect from '@/components/ui/SearchSelect.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

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

	import { useUsers } from '@/models/useUsers';
	const { getAllUsers } = useUsers();

	import { useSearch } from '$lib/models/useSearch';
	const { getItemsByMarketGroup, getItemMarketGroup } = useSearch();

	import { useCharacters } from '@/models/useCharacters';
	const { getMainCharacter } = useCharacters();

	import { API_ROUTES } from '$lib/models/useConstants';
	import { useApi } from '$lib/models/useApi';
	const { apiCall } = useApi();

	let allUsers = [];
	let allBuybacks = [];
	let allItemEntries = [];
	let filteredItemEntries = [];

	let newItemPercentage = 90;
	let newItemSelection = null;
	let existingItemSearch = '';
	let ready = false;

	onMount(async () => {
		allUsers = await getAllUsers();
		updateData();
		ready = true;
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

	const getUserName = (buyback) => {
		let user = allUsers.find((user) => user.id === buyback.user_id);
		const mainCharacter = getMainCharacter(user);
		return mainCharacter ? mainCharacter.name : 'Unknown';
	};

	const doFilter = debounce(() => {
		if (existingItemSearch) {
			filteredItemEntries = allItemEntries.filter((item) => {
				let matchesName = item.name.toLowerCase().includes(existingItemSearch.toLowerCase());
				let matchesMarketGroup = getItemMarketGroup(item.eve_type_id).name.toLowerCase().includes(existingItemSearch.toLowerCase());
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

<div class="flex flex-col px-3 pt-3 overflow-hidden h-full">
	<div class="flex justify-between items-center gap-3 text-3xl">
		<div>Buyback System Admin View</div>

		<Button on:click={() => safeGoto(WEB_ROUTES.buyback)} class="text-base">Switch to member view</Button>
	</div>

	{#if ready}
		<Tabs.Root value="buybackTable" class="flex flex-col flex-grow h-0 w-full">
			<Tabs.List class="flex gap-3 justify-start bg-transparent h-fit w-full border-b-2 rounded-none py-2">
				<Tabs.Trigger
					value="buybackTable"
					class="text-xl bg-background-800 text-background-50 data-[state=active]:bg-primary-600 data-[state=active]:text-background-50"
				>
					Buyback Table
				</Tabs.Trigger>
				<Tabs.Trigger
					value="itemsConfig"
					class="text-xl bg-background-800 text-background-50 data-[state=active]:bg-primary-600 data-[state=active]:text-background-50"
				>
					Items Config
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="buybackTable" class="overflow-hidden flex-grow">
				<div class="flex flex-col h-full">
					<div class="grid grid-cols-[200px,320px,1fr,190px,190px,100px,140px] bg-background-900">
						<div class="ml-4">User Name</div>
						<div class="ml-4">Contract ID</div>
						<div class="ml-4">Price</div>
						<!-- <div class="px-2"># Items</div> -->
						<div class="px-2">Created At</div>
						<div class="px-2">Last Updated</div>
						<div class="px-2">Status</div>
						<div class="flex justify-end px-2">Actions</div>
					</div>

					<div class="overflow-y-auto overflow-x-hidden">
						{#each allBuybacks as buyback}
							<div
								class="grid grid-cols-[200px,320px,1fr,190px,190px,100px,140px] items-center even:bg-background-700 odd:bg-background-800 py-1"
							>
								<div class="ml-4">
									{getUserName(buyback)}
								</div>
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
									<Select.Root
										selected={{ value: getState(buyback), label: getState(buyback) }}
										onSelectedChange={(event) => onChangeState(event, buyback)}
									>
										<Select.Trigger class="bg-background-900 text-white border-0 hover:bg-primary-900 capitalize w-28 h-fit py-1">
											<Select.Value placeholder="State" />
										</Select.Trigger>
										<Select.Content class="bg-background-900 text-background-50 border-background-800">
											<!-- <Select.Item value={BUYBACK_STATES.pending}>Pending</Select.Item> -->
											<Select.Item
												value={BUYBACK_STATES.completed}
												class="hover:!bg-background-800 hover:!text-background-50 cursor-pointer data-[highlighted]:!bg-primary-700 data-[highlighted]:!text-background-50"
												>Completed</Select.Item
											>
											<!-- <Select.Item value={BUYBACK_STATES.pending}>Pending</Select.Item> -->
											<Select.Item
												value={BUYBACK_STATES.rejected}
												class="hover:!bg-background-800 hover:!text-background-50 cursor-pointer data-[highlighted]:!bg-primary-700 data-[highlighted]:!text-background-50"
												>Rejected</Select.Item
											>
											<Select.Item
												value={BUYBACK_STATES.canceled}
												class="hover:!bg-background-800 hover:!text-background-50 cursor-pointer data-[highlighted]:!bg-primary-700 data-[highlighted]:!text-background-50"
												>Canceled</Select.Item
											>
										</Select.Content>
									</Select.Root>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</Tabs.Content>
			<Tabs.Content value="itemsConfig" class="overflow-hidden flex-grow">
				<div class="flex flex-col h-full">
					<div class="grid grid-cols-[80px,1fr,95px,100px] items-center bg-background-700 py-2">
						<div class="px-2 col-span-2">
							<SearchSelect
								placeholder="Item or Category"
								value={null}
								type={SEARCH_TYPES.ITEM_OR_MARKET_GROUP}
								on:selected={(value) => onChangeItemSelected(value)}
								showResultType
							/>
						</div>
						<div class="relative">
							<Input type="number" bind:value={newItemPercentage} step="0.01" class="w-16 py-0 px-2" />
							<div class="text-xl absolute" style="right: 10px; top: 2px">%</div>
						</div>
						<div class="flex justify-end px-2">
							<Button on:click={onNewItemEntry} class="text-base py-0 px-2 h-fit" disabled={!newItemSelection}>Add Entry</Button>
						</div>
					</div>

					<div class="grid grid-cols-[80px,1fr,95px,100px] bg-background-900">
						<div class="px-2">Item ID</div>
						<div class="px-2">Item Name</div>
						<div class="pr-2">% We Pay</div>
						<div class="flex px-2 justify-end">Actions</div>
					</div>

					<Input bind:value={existingItemSearch} placeholder="Search for item" class="border-background-600 my-1 w-full" />

					<div class="overflow-y-auto">
						{#each filteredItemEntries as item}
							<div class="grid grid-cols-[80px,1fr,95px,100px] items-center even:bg-background-800 odd:bg-background-700 py-1">
								<div class="px-2">{item.eve_type_id}</div>
								<div class="px-2">
									{item.name} ({getItemMarketGroup(item.eve_type_id).name})
								</div>
								<div class="relative px-2">
									<Input
										type="number"
										bind:value={item.percentage}
										step="1"
										max="100"
										class="w-16 py-0 px-2 h-fit"
										on:input={() => onEntryPercentageInput(item)}
									/>
									<div class="text-base absolute" style="right: 5px; top: -1px">%</div>
								</div>
								<div class="flex justify-end px-2">
									<Button on:click={() => onDeleteItemEntry(item)} class="text-base py-0 px-2 h-fit">Delete</Button>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</Tabs.Content>
		</Tabs.Root>
	{/if}
</div>
