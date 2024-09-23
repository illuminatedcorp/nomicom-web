import { get } from 'svelte/store';
import { browser } from '$app/environment';

import { API_ROUTES, WEB_ROUTES } from '$lib/models/useConstants';
import { userStore } from '$lib/stores/userStore';
import { useApi } from '$lib/models/useApi';
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
const { apiCall } = useApi();

const publicRoutes = [WEB_ROUTES.home, WEB_ROUTES.join, WEB_ROUTES.contact, WEB_ROUTES.login];

export const load = async () => {
	if (browser) {
		let route = window.location.pathname;

		// get the user data
		let userData = get(userStore);

		// if the user data is not initialized, we need to get it
		if (!userData.initialized) {
			let data = await apiCall(API_ROUTES.userData, {});

			if (data !== null) {
				userStore.set({
					...data,
					valid: true
				});
			} else {
				userStore.set({
					...userData,
					valid: false
				});
			}

			userData = get(userStore);
		}

		if (publicRoutes.includes(route)) {
			return {};
		}

		if (route === WEB_ROUTES.loginRedirect) {
			return {};
		}

		userStore.set({
			...userData,
			initialized: true
		});

		// here is where we check their permissions to see if they can access the route
		if (userData.valid) {
			return {};
		} else {
			// we want to redirect them to the login page
			goto(WEB_ROUTES.login);
			return {};
		}
	}
};
