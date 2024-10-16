import { fetchLovsFromApi } from '$lib/data/lov';
import { companyInfoFormSchema } from '$lib/schemas/companyInfo';
import { getSupabaseClient } from '$lib/supabase/server-supabase';
import { keysToCamelCase, keysToSnakeCase } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';


const fetchLovsData = async () => {
    try {
        const companyTypesOptions = await fetchLovsFromApi('companyTypesOptions');
        const employeeCountOptions = await fetchLovsFromApi('employeeCountOptions');
        const industriesOptions = await fetchLovsFromApi('industriesOptions');
        const compositionOptions = await fetchLovsFromApi('compositionOptions');
        const conditionOptions = await fetchLovsFromApi('conditionOptions');
        const modelOptions = await fetchLovsFromApi('modelOptions');

        return {
            companyTypesOptions,
            employeeCountOptions,
            industriesOptions,
            compositionOptions,
            conditionOptions,
            modelOptions
        };

    } catch (error) {
        return null;
    }
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const supabase = getSupabaseClient();
    const issuerId = params.issuerId;

    const form = await superValidate(zod(companyInfoFormSchema));
    const { data: companyData, error } = await supabase
        .from('company')
        .select('*')
        .eq('id', issuerId)
        .single();

    if (error) {
        return fail(400, { form, error: error.message });
    }

    const lovs = await fetchLovsData();
    // @ts-ignore
    form.data = keysToCamelCase(companyData);

    // @ts-ignore
    return { form, ...lovs };
};

export const actions = {
    saveCompany: async ({ request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(companyInfoFormSchema));
        if (!form.valid) {
            return fail(400, { form });
        }

        const company = {
            ...form.data,
            registrationDate: new Date(form.data.registrationDate).toISOString()
        };

        const supabase = getSupabaseClient();
        try {
            const { error: supabaseError } = await supabase
                .from('company')
                .update(keysToSnakeCase(company))
                .eq('id', company?.id)
                .single();

            if (supabaseError) {
                console.error(supabaseError);
            }

            return {
                form
            };
        } catch (e) {
            console.error(e);
            return {
                form,
                success: false
            };
        }
    }
};