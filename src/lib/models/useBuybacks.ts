import { useApi } from './useApi';
import { API_ROUTES } from './useConstants';
const { apiCall } = useApi();

export const useBuybacks = () => {
	const createBuybackRequest = async (itemArray) => {
		console.log('createBuybackRequest', itemArray);
		// const response = await apiCall(API_ROUTES.buybacks, itemArray);
		// return response.buyback;
	};

	const getAllBuybackRequests = async () => {
		const response = await apiCall(API_ROUTES.allBuybackRequests, {});
		return response.buyback_requests;
	};

	const getAllItemEntries = async () => {
		const response = await apiCall(API_ROUTES.allBuybackItems, {});
		return response.buyback_items;
	};

	return {
		createBuybackRequest,
		getAllBuybackRequests,
		getAllItemEntries
	};
};
