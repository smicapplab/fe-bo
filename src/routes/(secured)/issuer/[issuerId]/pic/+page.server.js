import { fetchLovsFromApi } from '$lib/data/lov';
import { profileFormSchema } from '$lib/schemas/profile';
import { keysToCamelCase } from '$lib/utils';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const fetchLovsData = async () => {
    try {
        const maritalStatusOptions = await fetchLovsFromApi('maritalStatusOptions');
        const idTypeOptions = await fetchLovsFromApi('idTypeOptions');
        const titleOptions = await fetchLovsFromApi('titleOptions');

        return {
            maritalStatusOptions,
            idTypeOptions,
            titleOptions
        };

    } catch (error) {
        return null;
    }
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
    const { supabase } = locals;
    const issuerId = params.issuerId;

    const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', issuerId)
        .single();

    const form = await superValidate(zod(profileFormSchema));
    const lov = await fetchLovsData();
    form.data = keysToCamelCase(profileData || {});

    // @ts-ignore
    return { form, ...lov };
}