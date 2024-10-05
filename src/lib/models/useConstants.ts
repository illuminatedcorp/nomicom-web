export const API_ROUTES = {
	login: { method: 'POST', route: '/characters' },
	users: { method: 'GET', route: '/users' },
	userData: { method: 'GET', route: '/me' },
	updateUserRoles: { method: 'PUT', route: '/users/:id' },
	roles: { method: 'GET', route: '/roles' },
	createRole: { method: 'POST', route: '/roles' },
	updateRole: { method: 'PUT', route: '/roles/:id' },
	deleteRole: { method: 'DELETE', route: '/roles/:id' },
	permissions: { method: 'GET', route: '/permissions' },
	buybackRequests: { method: 'GET', route: '/buyback_requests' },
	createBuybackRequest: { method: 'POST', route: '/buyback_requests' },
	allBuybackItems: { method: 'GET', route: '/buyback_items' },
	createBuybackItem: { method: 'POST', route: '/buyback_items' },
	getBuybackItem: { method: 'GET', route: '/buyback_items/:id' },
	updateBuybackItem: { method: 'PUT', route: '/buyback_items/:id' },
	deleteBuybackItem: { method: 'DELETE', route: '/buyback_items/:id' },
	cancelBuybackRequest: { method: 'PUT', route: '/buyback_requests/:id/cancel' },
	completeBuybackRequest: { method: 'PUT', route: '/buyback_requests/:id/complete' },
	rejectBuybackRequest: { method: 'PUT', route: '/buyback_requests/:id/reject' }
};

export const WEB_ROUTES = {
	home: '/',
	join: '/join',
	contact: '/contact',
	nomicon: '/nomicon',
	login: '/login',
	loginRedirect: '/login/redirect',
	buyback: '/nomicon/buyback',
	buybackAdmin: '/nomicon/buyback/admin',
	wiki: '/nomicon/wiki',
	admin: '/nomicon/admin',
	api: '/api'
};

export const BUYBACK_STATES = {
	pending: 'pending',
	rejected: 'rejected',
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
	[WEB_ROUTES.buyback]: ['index_buyback_requests', 'create_buyback_request'],
	[WEB_ROUTES.buybackAdmin]: ['admin'],
	[WEB_ROUTES.wiki]: ['fuckifiknow'],
	[WEB_ROUTES.admin]: ['admin'],
	[WEB_ROUTES.api]: ['admin']
};
