import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { keysToCamelCase } from '$lib/utils.js';

export const load = async ({ data, depends, fetch }) => {
	depends('supabase:auth');
	const supabase = isBrowser()
		? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				}
			})
		: createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				},
				cookies: {
					getAll() {
						// @ts-ignore
						return data?.cookies ?? [];
					},
					setAll: (cookiesToSet) => {
						cookiesToSet.forEach(({ name, value, options }) => {
							// @ts-ignore
							data?.cookies.set(name, value, {
								...options,
								path: '/'
							});
						});
					}
				}
			});

	//await new Promise(resolve => setTimeout(resolve, 1000));
	const {
		data: { session }
	} = await supabase.auth.getSession();

	let profile = null;
	if (session) {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (user) {
			const { data: profileData } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', user.id)
				.single();

				//const currentPath = url.pathname;
				profile = keysToCamelCase(profileData) || null;

			return {
				session,
				supabase,
				// @ts-ignore
				user: user ? keysToCamelCase(user) : null,
				profile,
			};
		}
	}
	return { session, supabase, user: null, profile };
};
