<script lang="ts">
	import { onMount } from 'svelte';
	// import { EventBus, Events } from '$lib/eventbus.js';

	import { WEB_ROUTES } from '@/models/useConstants.js';
	import { useAuth } from '@/models/useAuth.js';
	const { safeGoto } = useAuth();

	onMount(() => {
		// we want to get the route they tried to access
		const path = window.location.pathname;

		if (path.includes(WEB_ROUTES.wiki)) {
			// pattern is host/nomicon/wiki/slug
			let slugRegex = /\/nomicon\/wiki\/(.*)/g;
			let slug = slugRegex.exec(path)[1];
			if (slug) {
				// we want to save the target slug in local storage
				localStorage.setItem('wikiSlug', slug);
			}

			safeGoto(WEB_ROUTES.wiki);
		}

		if (path.includes(WEB_ROUTES.news)) {
			// pattern is host/nomicon/wiki/slug
			let slugRegex = /\/nomicon\/news\/(.*)/g;
			let slug = slugRegex.exec(path)[1];
			if (slug) {
				// we want to save the target slug in local storage
				localStorage.setItem('newsSlug', slug);
			}

			safeGoto(WEB_ROUTES.news);
		}
	});
</script>

<div></div>
