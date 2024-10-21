export const API_ROUTES = {
	login: { method: 'POST', route: '/characters' },
	addCharacter: { method: 'POST', route: '/characters' },
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
	rejectBuybackRequest: { method: 'PUT', route: '/buyback_requests/:id/reject' },
	getWikiIndex: { method: 'GET', route: '/wiki_pages' },
	createWikiPage: { method: 'POST', route: '/wiki_pages' },
	getWikiPage: { method: 'GET', route: '/wiki_pages/:id' },
	updateWikiPage: { method: 'PUT', route: '/wiki_pages/:id' },
	deleteWikiPage: { method: 'DELETE', route: '/wiki_pages/:id' },
	getNewsIndex: { method: 'GET', route: '/news_posts' },
	createNewsPost: { method: 'POST', route: '/news_posts' },
	getNewsPost: { method: 'GET', route: '/news_posts/:id' },
	updateNewsPost: { method: 'PUT', route: '/news_posts/:id' },
	deleteNewsPost: { method: 'DELETE', route: '/news_posts/:id' }
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
	api: '/api',
	news: '/nomicon/news'
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
	[WEB_ROUTES.wiki]: ['index_wiki_pages'],
	[WEB_ROUTES.admin]: ['admin'],
	[WEB_ROUTES.api]: ['admin'],
	[WEB_ROUTES.news]: ['index_news_posts']
};
