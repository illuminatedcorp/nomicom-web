// import locationData from '$lib/data/locations.json';
let locationData = []; // placeholder for location data for now till we need it later

import itemsData from '$lib/data/items.json' assert { type: 'json' };
import marketGroupsData from '$lib/data/marketGroups.json' assert { type: 'json' };

const itemsDataArray = Object.values(itemsData);
const marketGroupsDataArray = Object.values(marketGroupsData);

export const SEARCH_TYPES = {
	ITEM: 'item',
	MARKET_GROUP: 'marketGroup',
	ITEM_OR_MARKET_GROUP: 'itemOrMarketGroup',
	LOCATION: 'location'
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
			return item.marketGroupId === marketGroupId;
		});

		return items;
	};

	return {
		search,
		searchLocations,
		getItemsByMarketGroup
	};
};
