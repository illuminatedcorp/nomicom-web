import { API_ROUTES } from '$lib/models/useConstants';
import { useApi } from './useApi';
const { apiCall } = useApi();

export const useRoles = () => {
	const getAllRoles = async () => {
		let response = await apiCall(API_ROUTES.roles, {});
		return response.data;
	};

	const createRole = async () => {
		let newRole = {
			name: 'New Role',
			permissions: []
		};

		let response = await apiCall(API_ROUTES.createRole, newRole);
		return response.data;
	};

	const updateRole = async (role) => {
		// let response = await apiCall(API_ROUTES.roles, role);
		// return response.data;
	};

	return {
		getAllRoles,
		createRole,
		updateRole
	};
};
