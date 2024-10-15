import { aoiDocFormSchema, dtiDocFormSchema, mpDocFormSchema, secDocFormSchema } from '$lib/schemas/document';
import { keysToCamelCase, keysToSnakeCase } from '$lib/utils';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
    const issuerId = params.issuerId;

    const { supabase, user } = locals;
    const { data: companyData, error } = await supabase
        .from('company')
        .select('id, company_type, code')
        .eq('id', issuerId)
        .single();

    const company = keysToCamelCase(companyData);

    // @ts-ignore
    return { company };
};


const saveDocument = async ({ form, locals }) => {
	const { supabase } = locals;

	form.data.registrationDate = form.data.registrationDate
		? new Date(form.data.registrationDate).toISOString()
		: null;
	let documentData = keysToSnakeCase({ ...form.data });

	const { error } = await supabase
		.from('documents')
		.update(documentData) // newData is an object with the fields you want to update
		.eq('id', documentData.id)
		.single();

	if (error) {
		console.error('Error updating data:', error);
	}

	return {
		form
	};
};

export const actions = {
	saveDocumentSec: async ({ request, locals }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(secDocFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		return await saveDocument({ form, locals });
	},
	saveDocumentDti: async ({ request, locals }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(dtiDocFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		return await saveDocument({ form, locals });
	},
	saveDocumentAoi: async ({ request, locals }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(aoiDocFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		return await saveDocument({ form, locals });
	},
	saveDocumentMP: async ({ request, locals }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(mpDocFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		return await saveDocument({ form, locals });
	}
};
