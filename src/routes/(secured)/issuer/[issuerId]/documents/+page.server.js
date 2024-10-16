import { aoiDocFormSchema, dtiDocFormSchema, mpDocFormSchema, secDocFormSchema } from '$lib/schemas/document';
import { getSupabaseClient } from '$lib/supabase/server-supabase';
import { keysToCamelCase, keysToSnakeCase } from '$lib/utils';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const issuerId = params.issuerId;
    const supabase = getSupabaseClient();
    const { data: companyData } = await supabase
        .from('company')
        .select('id, company_type, code')
        .eq('id', issuerId)
        .single();

    const company = keysToCamelCase(companyData);

    // @ts-ignore
    return { company };
};

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const saveDocument = async ({ form }) => {
    const supabase = getSupabaseClient();        
    let documentData = keysToSnakeCase({ ...form.data });

    const { error } = await supabase
        .from('documents')
        .update(documentData) // newData is an object with the fields you want to update
        .eq('id', documentData.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating data:', error);
    }

    return {
        form
    };
};

export const actions = {
    /**
     * 
     * @param {*} param0 
     * @returns 
     */
    saveDocumentSec: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(secDocFormSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        return await saveDocument({ form, locals });
    },
    /**
     * 
     * @param {*} param0 
     * @returns 
     */
    saveDocumentDti: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(dtiDocFormSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        console.log("===>", form.data)

        return await saveDocument({ form, locals });
    },
    /**
     * 
     * @param {*} param0 
     * @returns 
     */
    saveDocumentAoi: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(aoiDocFormSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        return await saveDocument({ form, locals });
    },
    /**
     * 
     * @param {*} param0 
     * @returns 
     */
    saveDocumentMP: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(mpDocFormSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        return await saveDocument({ form, locals });
    }
};
