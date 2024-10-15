import { z } from 'zod';

const id = z.number().nullish();
const images = z.array(
	z.object({
		file: z.string().nullable(), // string or null
		url: z.string().nullable(), // string or null
		type: z.string().nullable(), // string or null
		name: z.string().nullish()
	})
);

const expirationDate = z
	.string({
		required_error: 'Expiration Date is required.',
		invalid_type_error: 'Expiration Date is required.'
	})
	.min(1, 'Expiration Date is required.');

const registrationDate = z
	.string({
		required_error: 'Registration Date is required.',
		invalid_type_error: 'Registration Date is required.'
	})
	.min(1, 'Registration Date is required.');

const number = z
	.string({
		required_error: 'Registration Date is required.'
	})
	.min(1, 'Registration Date is required.');

export const gisDocFormSchema = z.object({
	id,
	images
});

export const secDocFormSchema = z.object({
	id,
	images,
	registrationDate,
	number
});


export const dtiDocFormSchema = z.object({
	id,
	images,
	registrationDate,
	number
});

export const mpDocFormSchema = z.object({
	id,
	images,
	expirationDate,
	number
});

export const aoiDocFormSchema = z.object({
	id,
	images,
	registrationDate
});

export const aofDocFormSchema = z.object({
	id,
	images
});

export const aopDocFormSchema = z.object({
	id,
	images
});
