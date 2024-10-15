
// @ts-ignore
import { PUBLIC_LOV_URL } from '$env/static/public';

const baseUrl = `${PUBLIC_LOV_URL}/geo/`;
export const fetchProvinces = async () => {
	try {
		const res = await fetch(baseUrl + 'provinces-list.json');

		if (!res.ok) {
			console.error(`Error fetching provinces`);
			return [];
		}

		const data = await res.json();
		return data;
	} catch (error) {
		console.error('Fetch error:', error);
		return [];
	}
};

export const fetchCitiesByProvince = async (provinceCode) => {
	try {
		const res = await fetch(baseUrl + `cities/${provinceCode}.json`);

		if (!res.ok) {
			console.error(`Error fetching cities for province ${provinceCode}`);
			return [];
		}

		let citiesData = await res.json();
		citiesData.cities = citiesData.cities.map((city) => {
			// eslint-disable-next-line no-unused-vars
			const { barangays, ...cityWithoutBarangays } = city;
			return cityWithoutBarangays;
		});
		return citiesData.cities;
	} catch (error) {
		console.error('Fetch error:', error);
		return [];
	}
};

export const fetchBarangaysByCities = async (provinceCode, cityCode) => {
	try {
		const res = await fetch(baseUrl + `cities/${provinceCode}.json`);

		if (!res.ok) {
			console.error(`Error fetching cities for province ${provinceCode}`);
			return [];
		}

		let citiesData = await res.json();
		const city = citiesData.cities.find((/** @type {{ value: any; }} */ c) => c.value === cityCode);
		if (!city) {
			console.error(`City not found ${cityCode}`);
			return [];
		}
		return city.barangays;
	} catch (error) {
		console.error('Fetch error:', error);
		return [];
	}
};
