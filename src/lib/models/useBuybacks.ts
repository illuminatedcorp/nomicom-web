import moment from 'moment';

import { useApi } from './useApi';
import { API_ROUTES, BUYBACK_STATES } from './useConstants';
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

	const getState = (buyback) => {
		// so we want to determine which of the dates is the most recent
		// and use that to determine the state
		let stateDates = [
			{ date: buyback.inserted_at, state: BUYBACK_STATES.pending },
			{ date: buyback.completed_at, state: BUYBACK_STATES.completed },
			{ date: buyback.rejected_at, state: BUYBACK_STATES.rejected },
			{ date: buyback.canceled_at, state: BUYBACK_STATES.canceled }
		];

		// sort the dates with most recent first. nulls will be at the end
		// we use moment here for sanity
		stateDates.sort((a, b) => {
			if (!a.date) return 1; // Move null dates to the end
			if (!b.date) return -1; // Move null dates to the end

			if (moment.utc(a.date).isAfter(moment.utc(b.date))) {
				return -1; // Most recent first
			} else if (moment.utc(a.date).isBefore(moment.utc(b.date))) {
				return 1;
			} else {
				return 0;
			}
		});

		return stateDates[0].state;
	};

	const getUpdatedAtDate = (buyback) => {
		// so we want to determine which of the dates is the most recent
		// and use that to determine the state
		let stateDates = [
			{ date: buyback.inserted_at, state: BUYBACK_STATES.pending },
			{ date: buyback.completed_at, state: BUYBACK_STATES.completed },
			{ date: buyback.rejected_at, state: BUYBACK_STATES.rejected },
			{ date: buyback.canceled_at, state: BUYBACK_STATES.canceled }
		];

		// sort the dates with most recent first. nulls will be at the end
		// we use moment here for sanity
		stateDates.sort((a, b) => {
			if (!a.date) return 1; // Move null dates to the end
			if (!b.date) return -1; // Move null dates to the end

			if (moment.utc(a.date).isAfter(moment.utc(b.date))) {
				return -1; // Most recent first
			} else if (moment.utc(a.date).isBefore(moment.utc(b.date))) {
				return 1;
			} else {
				return 0;
			}
		});

		return stateDates[0].date;
	};

	return {
		createBuybackRequest,
		getAllBuybackRequests,
		getBuybackRequests,
		getAllItemEntries,
		cancelBuybackRequest,
		completeBuybackRequest,
		rejectBuybackRequest,
		getState,
		getUpdatedAtDate
	};
};
