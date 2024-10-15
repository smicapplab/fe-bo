import { keysToCamelCase, keysToSnakeCase } from '$lib/utils';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals, params }) {
	const { companyId } = params;
	const { supabase, user } = locals;
	const { type, selectedFile } = await request.json();

	let { data: document } = await supabase
		.from('documents')
		.select('*')
		.eq('company_id', companyId)
		.eq('type', type)
		.single();

	if( document ){
		const data = keysToCamelCase(document);
		const updatedImages = document.images.filter(image => image.url !== selectedFile.url);
		
		await supabase.from('documents').update(
			{ ...keysToSnakeCase({...data, images: updatedImages}) }
		).eq('id', document.id);
		
		return json({...data, images: updatedImages});
	}	

	return json({});
}
