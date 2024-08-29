import { json } from '@sveltejs/kit';
import { useREST } from '$lib/models/useREST';
const { doQuery } = useREST();

export async function POST({ request }) {
	const { apiRoute, params } = await request.json();
	const data = await doQuery(apiRoute, params);
	return json(data);
}
