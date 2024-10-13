import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginFormSchema } from '$lib/schemas/profile';

export const actions = {
	signInWithEmail: async ({ request, locals }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(loginFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { email, password } = form.data
		const { error } = await locals.supabase.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (error) {
			return fail(400, { form, error: error.message });
		}

		return {
			form
		};
	},
};
