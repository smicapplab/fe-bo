import { resolveFileType, uploadBase64File } from '$lib/aws/s3Helper';
import { keysToCamelCase, keysToSnakeCase } from '$lib/utils';
import { json } from '@sveltejs/kit';
import { AWS_ISUER_BUCKET } from '$env/static/private';
import { PUBLIC_ISSUER_DOC_URL } from '$env/static/public';
import { v4 as uuidv4 } from 'uuid';
import { getSupabaseClient } from '$lib/supabase/server-supabase';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, params }) {
	const { companyId } = params;

	const { type, name, data, companyCode } = await request.json();
	const supabase = getSupabaseClient();

	let { data: document } = await supabase
		.from('documents')
		.select('*')
		.eq('company_id', companyId)
		.eq('type', type)
		.single();

	let fileType = resolveFileType({ name, data });
	const fileName = `${companyCode}/documents/${uuidv4()}.${fileType}`

	await uploadBase64File({
		base64String: data,
		fileName,
		bucket: AWS_ISUER_BUCKET,
		fileType,
	});
	const url = `${PUBLIC_ISSUER_DOC_URL}/${fileName}`

	try {
		if (document) {
			document = keysToCamelCase(document);
			if (document.images) {
				document.images.push({
					file: null,
					name,
					url,
					type: fileType,
				});
			} else {
				document.images = [
					{
						file: null,
						name,
						url,
						type: fileType,
					}
				];
			}
			await supabase.from('documents').update(keysToSnakeCase(document)).eq('id', document.id);
			return json(document);
		} else {
			document = {
				type,
				companyId: companyId,
				images: [
					{
						file: null,
						name,
						url,
						type: fileType
					}
				]
			};
			const { error: docError, data: updatedDocument } = await supabase
				.from('documents')
				.insert(keysToSnakeCase(document))
				.select()
				.single();

			if (docError) {
				console.error(docError);
			}

			return json(keysToCamelCase(updatedDocument));
		}
	} catch (error) {
		return json({
			success: false,
			error
		});
	}
}
