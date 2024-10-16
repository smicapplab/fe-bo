import { fetchLovsFromApi } from '$lib/data/lov';
import { profileFormSchema } from '$lib/schemas/profile';
import { keysToCamelCase, keysToSnakeCase } from '$lib/utils';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { getSupabaseClient } from '$lib/supabase/server-supabase';

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
export async function load({ params }) {
    const supabase = getSupabaseClient();
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

export const actions = {
    savePersonal: async ({ request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(profileFormSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const profile = {
            ...form.data,
            dob: new Date(form.data.dob).toISOString(),
            idExpiry: form.data.idExpiry ? new Date(form.data.idExpiry).toISOString() : null,
            updated_at: new Date().toISOString(),
            full_name: `${form.data.firstName} ${form.data.lastName}`
        };

        const supabase = getSupabaseClient();
        try {
            const { error: supabaseError } = await supabase
                .from('profiles')
                .update(keysToSnakeCase(profile))
                .eq('id', profile?.id)

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