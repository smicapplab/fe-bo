import { getSupabaseClient } from '$lib/supabase/server-supabase';
import { keysToCamelCase } from '$lib/utils';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, params }) {
	const { companyId } = params;
	const supabase = getSupabaseClient();
	const { type } = await request.json();

	let { data: document } = await supabase
		.from('documents')
		.select('*')
		.eq('company_id', companyId)
		.eq('type', type)
		.single();

	if (document) {
		document = keysToCamelCase(document);
	}

	return json(
		document || {
			type,
			companyId: companyId,
			images: []
		}
	);
}
