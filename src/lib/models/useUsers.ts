import { useApi } from './useApi';
import { API_ROUTES } from './useConstants';
const { apiCall } = useApi();

// import { useCharacters } from './useCharacters';
// const { populateCharacterData } = useCharacters();

import { userStore } from '@/stores/userStore';

export const useUsers = () => {
	const setup = async () => {
		await getUserData();
	};

	const getUserData = async () => {
		// Skip API call to /me - set default invalid user state
		// const user = await apiCall(API_ROUTES.userData, {});
		
		// Set invalid user state to maintain existing UI behavior
		userStore.set({
			id: null,
			valid: false,
			initialized: true,
			characters: [],
			roles: [],
			hasValidWardenCheck: false
		});
	};

	const getPermissionList = (userData) => {
		let permissions = [];

		if (userData.roles === undefined || userData.roles.length === 0) {
			return permissions;
		}

		userData.roles.forEach((role) => {
			role.permissions.forEach((permission) => {
				if (!permissions.includes(permission)) {
					permissions.push(permission);
				}
			});
		});

		return permissions;
	};

	const getAllUsers = async () => {
		let response = await apiCall(API_ROUTES.users, {});
		return response.users;
	};

	const updateUserRoles = async (userData) => {
		let newRoles = userData.roles.map((role) => {
			return role.id;
		});

		let response = await apiCall(API_ROUTES.updateUserRoles, {
			id: userData.id,
			roles: newRoles
		});

		return response;
	};

	return {
		setup,
		getUserData,
		getPermissionList,
		getAllUsers,
		updateUserRoles
	};
};
