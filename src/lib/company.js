import CryptoJS from 'crypto-js';

const MAXIMUM_INITIAL_TRIAL = 100;
const CUSTOMER_INITIAL_LENGTH = 4;

const isAvailable = async ({ proposedInitial, supabase }) => {
    const { data: company, error: companyError } = await supabase
        .from('company')
        .select('id, code')
        .eq('code', proposedInitial)
        .maybeSingle();

    if (companyError) {
        console.error("companyError", companyError);
        return false;
    }

    return company ? false : true;
};

export const getRandomInitial = async ({ supabase }) => {
    for (let i = 1; i <= MAXIMUM_INITIAL_TRIAL; i++) {
        // Generate random bytes using crypto-js
        const proposedInitial = CryptoJS.lib.WordArray.random(CUSTOMER_INITIAL_LENGTH)
            .toString(CryptoJS.enc.Hex)
            .toUpperCase()
            .slice(0, CUSTOMER_INITIAL_LENGTH);

        if (await isAvailable({ proposedInitial, supabase })) {
            return proposedInitial;
        }
    }

    throw new Error('Company Generated Initial not found');
};

export const formatCompanyCode = ({ code, companyId }) => {
    return `PH-${code}-${padWithZeroes(companyId)}`;
}

export function padWithZeroes(num) {
    return num.toString().padStart(6, '0');
}