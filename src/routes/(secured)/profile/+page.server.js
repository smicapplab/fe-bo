import { updatePassword, updateProfileSchema } from '$lib/schemas/profile';
import { keysToCamelCase, keysToSnakeCase } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

// @ts-ignore
export async function load({ locals }) {
    const { supabase, user } = locals;

    const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

    /**
     * @type {*}
     */
    const form = await superValidate(zod(updateProfileSchema));
    form.data = keysToCamelCase(profileData);
    return { form };
};

export const actions = {
    // @ts-ignore
    saveProfile: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(updateProfileSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const profile = {
            ...form.data,
            updated_at: new Date().toISOString(),
            full_name: `${form.data.firstName} ${form.data.lastName}`
        };

        const { supabase } = locals;
        await supabase
            .from('profiles')
            .update(keysToSnakeCase(profile))
            .eq('id', profile.id).select()

        return {
            form
        };
    },
    // @ts-ignore
    changePassword: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(updatePassword));

        if (!form.valid) {
            return fail(400, { form });
        }

        const { supabase } = locals;
        const password = form.data.password;
        console.log(password)
        // Update the user's password using Supabase
        const { error } = await supabase.auth.updateUser({
            password
        });

        if (error) {
            return fail(500, { form, message: error.message });
        }

        return {
            form
        };
    }
}

