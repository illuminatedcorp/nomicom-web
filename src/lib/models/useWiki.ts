import { useApi } from './useApi';
import { API_ROUTES } from './useConstants';
const { apiCall } = useApi();

export const useWiki = () => {
	const getWikiIndex = async () => {
		const response = await apiCall(API_ROUTES.getWikiIndex, {});
		return response.wiki_pages;
	};

	const getWikiPage = async (slug: string) => {
		// first we need the index so we can get the page id
		const index = await getWikiIndex();
		const page = index.find((entry) => entry.slug === slug);
		if (!page) {
			return null;
		}

		const response = await apiCall(API_ROUTES.getWikiPage, { id: page.id });
		return response.wiki_page;
	};

	const createWikiPage = async () => {
		const defaultPageData = {
			body: 'Woah look a new page.',
			name: 'New Page',
			slug: 'new-page',
			sort_key: 1
		};

		const response = await apiCall(API_ROUTES.createWikiPage, defaultPageData);
		return response.wiki_page;
	};

	const saveWikiPage = async (pageData) => {
		const response = await apiCall(API_ROUTES.updateWikiPage, pageData);
		return response.wiki_page;
	};

	const deleteWikiPage = async (id: string) => {
		const response = await apiCall(API_ROUTES.deleteWikiPage, { id });
		if (!response) {
			return true;
		} else {
			return false;
		}
	};

	return {
		getWikiIndex,
		createWikiPage,
		getWikiPage,
		saveWikiPage,
		deleteWikiPage
	};
};
