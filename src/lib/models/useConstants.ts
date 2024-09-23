export const API_ROUTES = {
	login: {
		method: 'POST',
		route: '/characters'
	},
	userData: {
		method: 'GET',
		route: '/me'
	}
	// buybacksByUser: '/buybacksByUser',
	// getSession: '/getSession',
	// saveBuyback: '/saveBuyback',
	// allBuybacks: '/allBuybacks',
	// getAppraisal: '/getAppraisal'
};

export const WEB_ROUTES = {
	home: '/',
	join: '/join',
	contact: '/contact',
	nomicon: '/nomicon',
	login: '/login',
	loginRedirect: '/login/redirect',
	buyback: '/nomicon/buyback'
};

export const BUYBACK_STATES = {
	pending: 'pending',
	declined: 'declined',
	completed: 'completed',
	canceled: 'canceled'
};

export const SITE_MODES = {
	neutral: 'neutral',
	dark: 'dark',
	light: 'light'
};
