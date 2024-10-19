import { useWiki } from '@/models/useWiki.js';
const { getWikiIndex } = useWiki();

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
	const index = await getWikiIndex();
	const slugs = index.map((entry) => ({ slug: entry.slug }));

	return slugs;
}

export const prerender = true;
