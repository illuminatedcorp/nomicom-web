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
				valid: true,
				initialized: true,
				characters: user.characters,
				roles: user.roles
			});
		} else {
			userStore.set({
				valid: false,
				initialized: true,
				characters: [],
				roles: []
			});
		}
	};

	const getPermissionList = (userData) => {
		let permissions = [];

		userData.roles.forEach((role) => {
			role.permissions.forEach((permission) => {
				if (!permissions.includes(permission)) {
					permissions.push(permission);
				}
			});
		});

		return permissions;
	};

	return {
		setup,
		getUserData,
		getPermissionList
	};
};
