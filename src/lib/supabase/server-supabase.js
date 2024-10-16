import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRI_SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';

/**
 * @type {import("@supabase/supabase-js").SupabaseClient<any, "public", any> | null}
 */
let supabase = null;

export const getSupabaseClient = () => {
    if (!supabase) {
        supabase = createClient(PUBLIC_SUPABASE_URL, PRI_SUPABASE_SERVICE_ROLE_KEY)
    }
    return supabase;
}