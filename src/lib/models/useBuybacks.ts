import { useApi } from './useApi';
import { API_ROUTES } from './useConstants';
const { apiCall } = useApi();

export const useBuybacks = () => {
	const createBuybackRequest = async (itemArray) => {
		const response = await apiCall(API_ROUTES.createBuybackRequest, { item_list: itemArray });
		return response.buyback_request;
	};

	const getBuybackRequests = async (id) => {
		const response = await apiCall(API_ROUTES.buybackRequests, { id });
		return response.buyback_requests;
	};

	// this is identical for now incase we split the calls in the future for filtering purposes
	const getAllBuybackRequests = async () => {
		const response = await apiCall(API_ROUTES.buybackRequests, {});
		return response.buyback_requests;
	};

	const getAllItemEntries = async () => {
		const response = await apiCall(API_ROUTES.allBuybackItems, {});
		return response.buyback_items;
	};

	return {
		createBuybackRequest,
		getAllBuybackRequests,
		getBuybackRequests,
		getAllItemEntries
	};
};
