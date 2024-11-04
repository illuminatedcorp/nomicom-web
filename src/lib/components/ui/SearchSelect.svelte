<script lang="ts">
	import debounce from 'lodash/debounce';
	import { createEventDispatcher, onMount } from 'svelte';

	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';

	import { useSearch, SEARCH_TYPES } from '$lib/models/useSearch.js';
	const { search, searchLocations } = useSearch();

	const dispatch = createEventDispatcher();

	export let placeholder: string = 'Search...';
	export let value: { id?: number; name?: string; type?: string };
	export let type: string = SEARCH_TYPES.ITEM;
	export let showResultType: boolean = false;

	let searchTerm = '';
	let selectedOption: { value: { id?: number; name?: string; type?: string }; label?: string };

	let searchResults: { id?: number; name?: string; type?: string; ticker?: string }[] = [];

	const handleSearch = debounce(async () => {
		if (searchTerm.length > 2) {
			searchResults = await search(searchTerm, type);
		} else {
			searchResults = [];
		}
	}, 300);

	const onSelect = (event: { value: { id?: number; type?: string } } | undefined) => {
		dispatch('selected', event?.value);
	};

	onMount(async () => {
		if (value) {
			selectedOption = { value, label: value.name };
		} else if (type === 'location') {
			selectedOption = { value: null, label: 'Anywhere' };
		}

		if (type === SEARCH_TYPES.WIKI_CATEGORY) {
			searchResults = await search(searchTerm, type);
		}
	});
</script>

<Select.Root selected={selectedOption} onSelectedChange={onSelect}>
	<Select.Trigger class="bg-background-800 hover:bg-background-900 border-0">
		<Select.Value {placeholder} class="!text-background-50" />
	</Select.Trigger>
	<Select.Content class="bg-background-800 text-background-50 border-0">
		<Input
			bind:value={searchTerm}
			on:input={handleSearch}
			placeholder="Search..."
			class="bg-background-900 text-background-50 !placeholder-background-50 border-0"
		/>
		{#if type === 'location'}
			<Select.Item value={null} class="cursor-pointer">Anywhere</Select.Item>
		{/if}
		{#if searchResults.length > 0}
			<div class="overflow-y-auto max-h-40 mt-1">
				{#each searchResults as result}
					<Select.Item
						value={result}
						class="flex flex-col items-start cursor-pointer hover:!bg-background-900 hover:!text-background-50"
					>
						<div>{result.name}</div>
						{#if showResultType}
							<div class="ml-2 text-xs text-background-200">{result.type}</div>
						{/if}
					</Select.Item>
				{/each}
			</div>
		{:else}
			<div class="text-xs mt-2 px-2">Search for results</div>
		{/if}
	</Select.Content>
</Select.Root>
