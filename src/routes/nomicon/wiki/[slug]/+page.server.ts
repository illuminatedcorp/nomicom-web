import { useBirdhouse } from '@/models/useBirdhouse.js';
const { getWikiIndex } = useBirdhouse();

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
	const index = await getWikiIndex();
	const slugs = index.map((entry) => ({ slug: entry.slug }));

	return slugs;
}

export const prerender = true;
