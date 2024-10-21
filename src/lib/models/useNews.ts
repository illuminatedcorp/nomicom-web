import moment from 'moment';

import { useApi } from './useApi';
import { API_ROUTES } from './useConstants';
const { apiCall } = useApi();

import { useAuth } from '@/models/useAuth.js';
const { hasPermission } = useAuth();

export type NewsPost = {
	id: string;
	title: string;
	slug: string;
	body: string;
	published_at: string;
};

export const useNews = () => {
	const getNewsIndex = async (): Promise<NewsPost[]> => {
		const response = await apiCall(API_ROUTES.getNewsIndex, {});
		if (!response) {
			return [];
		}

		if (
			hasPermission('admin') ||
			hasPermission('update_news_post') ||
			hasPermission('create_news_post') ||
			hasPermission('delete_news_post')
		) {
			return response.news_posts;
		} else {
			const filteredPosts = response.news_posts.filter((post) => {
				return post.published_at !== null || moment(post.published_at).isBefore(moment());
			});
			return filteredPosts;
		}
	};

	const getNewsFeed = async (): Promise<NewsPost[]> => {
		const index = await getNewsIndex();

		// the feed should never return unpublished posts
		const filteredPosts = index.filter((post) => {
			return post.published_at !== null || moment(post.published_at).isBefore(moment());
		});

		// only return the first 5 posts
		return filteredPosts.slice(0, 5);
	};

	const getNewsPost = async (slug: string): Promise<NewsPost | null> => {
		// first we need the index so we can get the post id
		const index = await getNewsIndex();
		const post = index.find((entry) => entry.slug === slug);
		if (!post) {
			return null;
		}

		const response = await apiCall(API_ROUTES.getNewsPost, { id: post.id });
		return response.news_post;
	};

	const createNewsPost = async (): Promise<NewsPost | null> => {
		const defaultPostData = {
			body: 'Woah look a new news post.',
			title: 'New Post',
			slug: 'new-post',
			published_at: null
		};

		const response = await apiCall(API_ROUTES.createNewsPost, defaultPostData);
		return response;
	};

	const saveNewsPost = async (postData): Promise<NewsPost | null> => {
		const response = await apiCall(API_ROUTES.updateNewsPost, postData);
		return response.news_post;
	};

	const deleteNewsPost = async (id: string): Promise<boolean> => {
		const response = await apiCall(API_ROUTES.deleteNewsPost, { id });
		if (!response) {
			return true;
		} else {
			return false;
		}
	};

	return {
		getNewsFeed,
		getNewsIndex,
		createNewsPost,
		getNewsPost,
		saveNewsPost,
		deleteNewsPost
	};
};
