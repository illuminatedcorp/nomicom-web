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
				initialized: true,
				characters: user.characters
			});
		} else {
			userStore.set({
				valid: false,
				initialized: true,
				characters: []
			});
		}
	};

	return {
		setup,
		getUserData
		// getUserDataByToken
	};
};
