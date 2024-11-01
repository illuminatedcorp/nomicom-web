import { useApi } from './useApi';
import { API_ROUTES } from './useConstants';
const { apiCall } = useApi();

// import { useCharacters } from './useCharacters';
// const { populateCharacterData } = useCharacters();

import { userStore } from '@/stores/userStore';

export const useUsers = () => {
	const setup = async () => {
		getUserData();
	};

	const getUserData = async () => {
		const user = await apiCall(API_ROUTES.userData, {});

		if (user) {
			// if (user.characters.length > 0) {
			// 	// we want to go populate the character records with some ESI information to make our lives easier
			// 	let newCharacters = await populateCharacterData(user.characters);
			// 	user.characters = newCharacters;
			// }

			userStore.set({
				id: user.id,
				valid: true,
				initialized: true,
				characters: user.characters,
				roles: user.roles,
				hasValidWardenCheck: user.has_valid_warden_check
			});
		} else {
			userStore.set({
				id: null,
				valid: false,
				initialized: true,
				characters: [],
				roles: [],
				hasValidWardenCheck: false
			});
		}
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
