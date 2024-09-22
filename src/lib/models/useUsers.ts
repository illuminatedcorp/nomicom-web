import { useApi } from './useApi';
import { API_ROUTES } from './useConstants';
const { apiCall } = useApi();

import { userStore } from '@/stores/userStore';

export const useUsers = () => {
	const setup = async () => {
		getUserData();
	};

	const getUserData = async () => {
		const user = await apiCall(API_ROUTES.userData, {});

		if (user) {
			userStore.set({
				valid: true,
				characters: user.characters
			});
		}
	};

	// const getUserDataByToken = async (id) => {
	// 	try {
	// 		const response = await fetch(`/api/v1/users/${id}`);
	// 		const data = await response.json();
	// 		if (data.error) {
	// 			console.error(data.error);
	// 			return null;
	// 		} else {
	// 			return data;
	// 		}
	// 	} catch (error) {
	// 		console.error(error);
	// 		return null;
	// 	}
	// };

	return {
		setup,
		getUserData
		// getUserDataByToken
	};
};
