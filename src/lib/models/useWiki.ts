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

	const getWikiCategories = async () => {
		const response = await apiCall(API_ROUTES.getWikiCategories, {});
		return response.wiki_categories;
	};

	const createWikiCategory = async (categoryData) => {
		categoryData.sort_key = 1;
		const response = await apiCall(API_ROUTES.createWikiCategory, categoryData);
		console.log(response);
		return response.wiki_category;
	};

	const saveWikiCategory = async (categoryData) => {
		const response = await apiCall(API_ROUTES.updateWikiCategory, categoryData);
		return response.wiki_category;
	};

	const deleteWikiCategory = async (id: string) => {
		const response = await apiCall(API_ROUTES.deleteWikiCategory, { id });
		if (!response) {
			return true;
		} else {
			return false;
		}
	};

	const getWikiCategory = async (id: string) => {
		const response = await apiCall(API_ROUTES.getWikiCategory, { id });
		return response.wiki_category;
	};

	return {
		getWikiIndex,
		createWikiPage,
		getWikiPage,
		saveWikiPage,
		deleteWikiPage,
		getWikiCategories,
		createWikiCategory,
		getWikiCategory,
		saveWikiCategory,
		deleteWikiCategory
	};
};
