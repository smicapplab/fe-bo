import { fetchLovsFromApi } from '$lib/data/lov';
import { companyInfoFormSchema } from '$lib/schemas/companyInfo';
import { keysToCamelCase } from '$lib/utils';
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
export async function load({ locals, params }) {
    const { supabase } = locals;
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