import { json } from '@sveltejs/kit';
import { keysToCamelCase } from '$lib/utils';
import { getSupabaseClient } from '$lib/supabase/server-supabase';

export async function POST({ request }) {
    const body = await request.json();
    const { filter } = body;
    const supabase = getSupabaseClient();

    // Step 1: Fetch companies and all related profiles
    let query = supabase
        .from('company')
        .select(`
            id, company_type, company_name, email, created_at, status,
            profiles (
                first_name, last_name, mobile, email
            )
        `);

    // Apply the filter for status if it's not empty
    if (filter.status && filter.status.length > 0) {
        query = query.in('status', filter.status);
    }

    // Apply the filter for keyword (company_name) if it's not empty
    if (filter.keyword && filter.keyword.trim() !== '') {
        query = query.ilike('company_name', `%${filter.keyword}%`);
    }

    // Step 2: Execute the query
    const { data, error } = await query;

    // Check for errors
    if (error) {
        console.error('Error fetching data:', error);
    } else {
        // Step 3: Post-process the data to select only the first profile per company
        const companiesWithFirstProfile = data.map(company => {
            if (company.profiles && company.profiles.length > 0) {
                company.contact = company.profiles[0]; // Take the first profile
            }
            delete company.profiles; // Remove the full profiles array to keep only the first profile
            return company;
        });

        return json(keysToCamelCase(companiesWithFirstProfile))
    }
}
