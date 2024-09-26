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
			description: 'New Role Description',
			permissions: []
		};

		let response = await apiCall(API_ROUTES.createRole, newRole);
		return response.data;
	};

	const updateRole = async (role) => {
		let response = await apiCall(API_ROUTES.updateRole, role);
		return response.data;
	};

	const deleteRole = async (role) => {
		let response = await apiCall(API_ROUTES.deleteRole, role);
		return response.data;
	};

	const getAllPermissions = async () => {
		let response = await apiCall(API_ROUTES.permissions, {});
		return response.permissions;
	};

	return {
		getAllRoles,
		createRole,
		updateRole,
		deleteRole,
		getAllPermissions
	};
};
