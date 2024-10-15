import { PUBLIC_LOV_URL } from '$env/static/public';

const baseGeneralUrl = `${PUBLIC_LOV_URL}/general/`;

export const getSelectedOption = (options, value) => {
	if (options.length === 0 || !value) {
		return { value: null, label: '' };
	}

	// @ts-ignore
	return options.find((option) => option.value === value);
};

/**
 * Fetch LOVs from API based on the given filename
 * @param {string} lovFile - the filename of the LOV without the extension
 * @returns {Promise<any[]>} - a promise that resolves to the LOV data
 */

export const fetchLovsFromApi = async (lovFile) => {
	try {
		const res = await fetch(baseGeneralUrl + `${lovFile}.json`, {
			method: 'GET',
			mode: 'cors',
			credentials: 'omit', // or 'include' if using cookies
		});

		if (!res.ok) {
			console.error(`No LOVs found: ${lovFile}`);
			return [];
		}

		let data = await res.json();
		return data;
	} catch (error) {
		console.error('Fetch error:', error);
		return [];
	}

}