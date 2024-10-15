import { getRandomInitial } from '$lib/company';
import { keysToCamelCase } from '$lib/utils.js';
import { json } from '@sveltejs/kit';

export async function POST({ params, locals }) {
	try {
		const { companyId, select = '*' } = params;
		const { supabase } = locals;
		let { error, data: company } = await supabase
			.from('company')
			.select(select)
			.eq('id', companyId).single();
	
		if (error) {
			console.error('Error getting company:', companyId, error);
		}
	
		if (!company.code) {
			const code = await getRandomInitial({ supabase })
			const { error: newCompanyError } = await supabase
				.from('company')
				.update({
					code
				})
				.eq('id', companyId)
	
			if (newCompanyError) {
				console.error("newCompanyError", newCompanyError);
			}
	
			company.code = code;
		}
	
		return json(keysToCamelCase(company));
	} catch (error) {
		console.error(error)
	}

}
