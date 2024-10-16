import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userFormSchema } from '$lib/schemas/profile';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRI_SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const actions = {
    // @ts-ignore
    saveUser: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(userFormSchema));
        if (!form.valid) {
            return fail(400, { form });
        }
        const { id, roleId, firstName, lastName, email, password, mobile } = form.data
        const supabase = createClient(PUBLIC_SUPABASE_URL, PRI_SUPABASE_SERVICE_ROLE_KEY)
        if (id) {
            // update here!!!!!
        } else {
            const { data, error } = await supabase.auth.admin.createUser({
                email: email,
                password: password,
                email_confirm: true,
                user_metadata: {
                    full_name: `${firstName} ${lastName}`,
                    mobile: mobile || "",
                    first_name: firstName,
                    last_name: lastName,
                    roleId: roleId,
                    email: email,
                },
            });

            if (error) {
                console.error(error)
                return fail(400, { form, error: error.message });
            }
        }

        return {
            form
        };

    }
};

