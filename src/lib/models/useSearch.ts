// import locationData from '$lib/data/locations.json';
let locationData = []; // placeholder for location data for now till we need it later

import itemsData from '$lib/data/items.json' assert { type: 'json' };
import marketGroupsData from '$lib/data/marketGroups.json' assert { type: 'json' };

const itemsDataArray = Object.values(itemsData);
const marketGroupsDataArray = Object.values(marketGroupsData);

import { useWiki } from '@/models/useWiki';
const { getWikiCategories } = useWiki();

export const SEARCH_TYPES = {
	ITEM: 'item',
	MARKET_GROUP: 'marketGroup',
	ITEM_OR_MARKET_GROUP: 'itemOrMarketGroup',
	LOCATION: 'location',
	WIKI_CATEGORY: 'wikiCategory'
};

export const useSearch = () => {
	const search = async (searchTerm: string, type: string) => {
		let results = [];

		if (type === SEARCH_TYPES.ITEM_OR_MARKET_GROUP) {
			const itemResults = itemsDataArray
				.filter((item: any) => {
					return item.name.toLowerCase().includes(searchTerm.toLowerCase());
				})
				.map((item: any) => {
					return {
						name: item.name,
						id: item.itemTypeID,
						type: SEARCH_TYPES.ITEM
					};
				});

			const marketGroupResults = marketGroupsDataArray
				.filter((marketGroup: any) => {
					return marketGroup.name.toLowerCase().includes(searchTerm.toLowerCase());
				})
				.map((marketGroup: any) => {
					return {
						name: marketGroup.name,
						id: marketGroup.marketGroupID,
						type: SEARCH_TYPES.MARKET_GROUP
					};
				});

			results = [...marketGroupResults, ...itemResults];
		}

		if (type === SEARCH_TYPES.WIKI_CATEGORY) {
			// first we get the wiki categories from the BE
			const wikiCategories = await getWikiCategories();

			// then we filter the categories based on the search term
			results = wikiCategories
				.filter((category: any) => {
					return category.name.toLowerCase().includes(searchTerm.toLowerCase());
				})
				.map((category: any) => {
					return {
						name: category.name,
						id: category.id,
						type: SEARCH_TYPES.WIKI_CATEGORY
					};
				});
		}

		return results;
	};

	const searchLocations = async (searchTerm: string) => {
		const results = locationData.filter((location: any) => {
			return location.name.toLowerCase().includes(searchTerm.toLowerCase());
		});

		return results;
	};

	const getItemsByMarketGroup = async (marketGroupId: number) => {
		const items = itemsDataArray.filter((item: any) => {
			return item.marketGroupID === marketGroupId;
		});

		return items;
	};

	const getItemMarketGroup = (itemId: number) => {
		const item = itemsDataArray.find((item: any) => {
			return item.itemTypeID === itemId;
		});

		const marketGroup = marketGroupsDataArray.find((marketGroup: any) => {
			return marketGroup.marketGroupID === item.marketGroupID;
		});

		return marketGroup;
	};

	return {
		search,
		searchLocations,
		getItemsByMarketGroup,
		getItemMarketGroup
	};
};
