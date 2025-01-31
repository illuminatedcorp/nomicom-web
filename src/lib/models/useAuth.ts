import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

import { toast } from 'svelte-sonner';

import { API_ROUTES, WEB_ROUTES, ROUTE_PERMISSIONS } from '$lib/models/useConstants';

import { userStore } from '$lib/stores/userStore';
import { useUsers } from '@/models/useUsers';
const { getUserData, getPermissionList } = useUsers();

import { useApi } from '$lib/models/useApi';
const { apiCall } = useApi();

const publicRoutes = [WEB_ROUTES.home, WEB_ROUTES.join, WEB_ROUTES.contact, WEB_ROUTES.login];

export const useAuth = () => {
	const onLoad = async () => {
		if (browser) {
			let route = window.location.pathname;

			// get the user data
			let userData = get(userStore);

			// if the user data is not initialized, we need to get it
			if (!userData.initialized) {
				await getUserData();

				userData = get(userStore);
			}

			if (publicRoutes.includes(route)) {
				return {};
			}

			if (route === WEB_ROUTES.loginRedirect) {
				return {};
			}

			// here is where we check their permissions to see if they can access the route
			if (userData.valid) {
				// we need to check their permissions
				let permissions = ROUTE_PERMISSIONS[route];

				let userPermissions = getPermissionList(userData);

				// if they are an admin, they can go anywhere
				if (userPermissions.includes('admin')) {
					return {};
				}

				if (permissions?.length > 0 && permissions.some((permission) => userPermissions.includes(permission))) {
					return {};
				} else {
					// we want to redirect them to the base nomicon page

					// if they were trying to go to another page, we get it from localstorage
					let redirect = localStorage.getItem('loginRedirect');

					if (redirect) {
						localStorage.removeItem('loginRedirect');
						goto(redirect);
					} else {
						goto(WEB_ROUTES.nomicon);
					}

					return {};
				}
			} else {
				// we want to save the current route so we can redirect them back after login
				localStorage.setItem('loginRedirect', route);

				goto(WEB_ROUTES.login);
				return {};
			}
		}
	};

	const safeGoto = (route) => {
		// get the user data
		let userData = get(userStore);

		// if it is a public route, we let them through and end here
		if (publicRoutes.includes(route)) {
			goto(route);
			return;
		}

		// otherwise it is NOT a public route, aka a nomicon route
		if (userData.valid) {
			if (hasAccessToRoute(route)) {
				// if they have the right perms, we let them through
				goto(route);
				return;
			} else {
				// otherwise we want to redirect them to the base nomicon page
				toast.error('You do not have permission to access that page. If you believe this to be in error, please contact an administrator.');
				return;
			}
		} else {
			// for some reason the user data is not valid, so we kick them back to the login page
			goto(WEB_ROUTES.login);
			return;
		}
	};

	const hasAccessToRoute = (route) => {
		// get the user data
		let userData = get(userStore);

		// if it is a public route, we let them through and end here
		if (publicRoutes.includes(route)) {
			return true;
		}

		// otherwise it is NOT a public route, aka a nomicon route
		if (userData.valid) {
			// we need to check their permissions
			let permissions = ROUTE_PERMISSIONS[route];

			if (route.includes(WEB_ROUTES.wiki)) {
				permissions = ROUTE_PERMISSIONS[WEB_ROUTES.wiki];
			}

			if (route.includes(WEB_ROUTES.news)) {
				permissions = ROUTE_PERMISSIONS[WEB_ROUTES.news];
			}

			if (permissions === undefined) {
				// we tried to call this route without defined permissions, which is a bug
				// we don't error out, but we don't let them through either
				return false;
			}

			// get the array of actual permissions we need to check
			let userPermissions = getPermissionList(userData);

			// if they are an admin, they can go anywhere
			if (userPermissions.includes('admin')) {
				return true;
			}

			// if there are permissions to check on the route, we see if the user has them
			if (permissions.length > 0) {
				// if there are permissions we need to check, then we check them
				if (permissions.some((permission) => userPermissions.includes(permission))) {
					return true;
				} else {
					return false;
				}
			} else {
				// otherwise the route has no permissions, so we let them through
				// goto(WEB_ROUTES.nomicon);
				return true;
			}
		} else {
			// for some reason the user data is not valid, so we kick them back to the login page
			return false;
		}
	};

	const hasPermission = (permission) => {
		// get the user data
		let userData = get(userStore);

		if (userData.valid) {
			let userPermissions = getPermissionList(userData);

			if (userPermissions.includes('admin')) {
				return true;
			}

			if (userPermissions.includes(permission)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};

	const hasRole = (role) => {
		// get the user data
		let userData = get(userStore);

		if (userData.valid) {
			let roleNames = userData.roles.map((role) => role.name.toLowerCase());

			if (roleNames.includes(role)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};

	return {
		onLoad,
		safeGoto,
		hasAccessToRoute,
		hasPermission,
		hasRole
	};
};
