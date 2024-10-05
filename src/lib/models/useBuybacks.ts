import { useApi } from './useApi';
import { API_ROUTES } from './useConstants';
const { apiCall } = useApi();

export const useBuybacks = () => {
	const createBuybackRequest = async (itemArray) => {
		const response = await apiCall(API_ROUTES.createBuybackRequest, { item_list: itemArray });
		return response.buyback_request;
	};

	const getBuybackRequests = async () => {
		const response = await apiCall(API_ROUTES.buybackRequests, {});
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

	const cancelBuybackRequest = async (buybackRequestId) => {
		const response = await apiCall(API_ROUTES.cancelBuybackRequest, { id: buybackRequestId });
		return response.buyback_request;
	};

	const completeBuybackRequest = async (buybackRequestId) => {
		const response = await apiCall(API_ROUTES.completeBuybackRequest, { id: buybackRequestId });
		return response.buyback_request;
	};

	const rejectBuybackRequest = async (buybackRequestId) => {
		const response = await apiCall(API_ROUTES.rejectBuybackRequest, { id: buybackRequestId });
		return response.buyback_request;
	};

	return {
		createBuybackRequest,
		getAllBuybackRequests,
		getBuybackRequests,
		getAllItemEntries,
		cancelBuybackRequest,
		completeBuybackRequest,
		rejectBuybackRequest
	};
};
