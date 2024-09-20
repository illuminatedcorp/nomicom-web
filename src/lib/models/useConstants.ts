export const API_ROUTES = {
	login: {
		method: 'POST',
		route: '/characters'
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
	portal: '/portal',
	login: '/portal/login',
	loginRedirect: '/portal/login/redirect',
	buyback: '/portal/buyback'
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
