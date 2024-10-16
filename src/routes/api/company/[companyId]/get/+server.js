import { getRandomInitial } from '$lib/company';
import { getSupabaseClient } from '$lib/supabase/server-supabase';
import { keysToCamelCase } from '$lib/utils.js';
import { json } from '@sveltejs/kit';

/**
 * @typedef {import('@supabase/supabase-js').SupabaseClient} SupabaseClient
 */

/**
 * @typedef {object} Company
 * @property {number} id - The ID of the company.
 * @property {string} [code] - The code of the company.
 * @property {string} name - The name of the company.
 * // Add any other properties of the company here
 */

/**
 * Handles a POST request to fetch and update a company's information.
 *
 * @param {object} request - The request object provided by SvelteKit.
 * @param {object} request.params - The parameters passed in the request.
 * @param {string} request.params.companyId - The ID of the company to fetch.
 * @param {string} [request.params.select='*'] - The fields to select in the query (optional).
 * @returns {Promise<object | undefined>} A Promise that resolves to a JSON response containing the company data with keys converted to camel case, or undefined in case of an error.
 */
export async function POST({ params }) {
	try {
		const { companyId, select = '*' } = params;
		const supabase = getSupabaseClient();

		/** @type {{ error: object | null, data: Company | null }} */
		let { error, data: company } = await supabase
			.from('company')
			.select(select)
			.eq('id', companyId).single();

		// Handle error or null company
		if (error || !company) {
			console.error('Error getting company or company not found:', companyId, error);
			return; // Return undefined in case of an error or if the company is not found
		}

		if (!company.code) {
			/** @type {string} */
			const code = await getRandomInitial({ supabase })

			/** @type {{ error: object | null }} */
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
