export const API_ROUTES = {
	login: {
		method: 'POST',
		route: '/characters'
	},
	userData: {
		method: 'GET',
		route: '/me'
	}
};

export const WEB_ROUTES = {
	home: '/',
	join: '/join',
	contact: '/contact',
	nomicon: '/nomicon',
	login: '/login',
	loginRedirect: '/login/redirect',
	buyback: '/nomicon/buyback',
	wiki: '/nomicon/wiki',
	admin: '/nomicon/admin'
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

export const ROUTE_PERMISSIONS = {
	[WEB_ROUTES.nomicon]: [],
	[WEB_ROUTES.buyback]: ['fuckifiknow'],
	[WEB_ROUTES.wiki]: ['fuckifiknow'],
	[WEB_ROUTES.admin]: ['admin']
};
