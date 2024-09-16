import itemsData from '$lib/data/items.json';
const itemsDataArray = Object.values(itemsData);

import { useDatabase } from '$lib/models/useDatabase';
const { getPriceEntryByItemTypeId, getPriceEntryByMarketGroupId } = useDatabase();

import { useFuzzworks } from '$lib/models/useFuzzworks';
const { getAppraisal } = useFuzzworks();

export const usePrices = () => {
	const getItemPrices = async (itemsArray) => {
		const itemPrices = [];
		for (const item of itemsArray) {
			const price = await getPriceOfItem(item);
			itemPrices.push({
				...item,
				price
			});
		}
		return itemPrices;
	};

	const getPriceOfItem = async (itemEntry) => {
		let item = itemsDataArray.find((item) => item.name === itemEntry.name);
		// so we need to first get the price entry
		// the first thing we check is if we have a category entry
		const marketGroupId = item.marketGroupID;
		const itemTypeId = item.itemTypeID;

		// the default settings for adjusting the item price
		let percentage = 10;
		let direction = 'below';
		let orderType = 'buy';

		const marketGroupPriceResult = await getPriceEntryByMarketGroupId(marketGroupId);
		const marketGroupPriceEntry = marketGroupPriceResult.rows[0];
		// if we do, we'll use that

		if (marketGroupPriceEntry) {
			percentage = marketGroupPriceEntry.percentage;
			direction = marketGroupPriceEntry.direction;
			orderType = marketGroupPriceEntry.orderType;
		} else {
			// if we don't, we'll use the item price
			const itemPriceResult = await getPriceEntryByItemTypeId(itemTypeId);
			const itemPriceEntry = itemPriceResult.rows[0];

			if (itemPriceEntry) {
				percentage = itemPriceEntry.percentage;
				direction = itemPriceEntry.direction;
				orderType = itemPriceEntry.orderType;
			}
		}

		// by this point we have the desired settings
		// now we want to take the item and get its appraisal

		const appraisal = await getAppraisal([itemTypeId]);

		// now we have the appraisal
		// we want to get the price based on the order type setting
		let price = parseFloat(appraisal[itemTypeId].buy.max);
		if (orderType === 'sell') {
			price = parseFloat(appraisal[itemTypeId].sell.min);
		}

		// now we have the price
		// we want to adjust it based on the settings
		if (direction === 'below') {
			price = price - price * (percentage / 100);
		} else {
			price = price + price * (percentage / 100);
		}

		return price;
	};

	return {
		getItemPrices
	};
};
