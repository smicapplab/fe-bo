import { z } from 'zod';
import {
	address,
	barangay,
	city,
	dob,
	email,
	firstName,
	lastName,
	maritalStatus,
	middleName,
	mobile,
	password,
	province,
	title
} from './shape-properties';

export const loginFormSchema = z.object({
	email,
	password: z.string({
		required_error: 'Password is required.'
	}).min(1, 'Password is required.')
});

export const userFormSchema = z.object({
	id: z.string().nullish(),
	roleId: z.number(),
	firstName,
	lastName,
	email,
	password,
	mobile
});

export const pqlFormSchema = z.object({
	reasonStatus: z.array(z.string()).nullish(),
	questions: z.array(z.object({
		name: z.string().optional(),
		question: z.string().optional(),
		options: z.array(z.string().optional()),
		multiple: z.boolean().optional()
	})).optional(),  // Mark it optional if it's not always present
	isBusinessRegistered: z
		.string()
		.nullable()
		.default(null)
		.refine((val) => val !== null, {
			message: 'Please let us know if your business is registered.'
		}),
	hasPermitToOperate: z
		.string()
		.nullable()
		.default(null)
		.refine((val) => val !== null, {
			message: 'Please indicate if you have a permit to operate.'
		}),
	hasFinancialStatement: z
		.string()
		.nullable()
		.default(null)
		.refine((val) => val !== null, {
			message: 'Please confirm if you have a financial statement.'
		}),
	howLongOperating: z
		.string()
		.nullable()
		.default(null)
		.refine((val) => val !== null && val.trim() !== '', {
			message: 'Please specify how long your business has been operating.'
		}),
	hasCheckingAccount: z
		.string()
		.nullable()
		.default(null)
		.refine((val) => val !== null, {
			message: 'Please let us know if you have a checking account.'
		}),
	typeOfCustomers: z
		.array(z.string())
		.min(1, { message: 'Please select at least one type of customer your business serves.' })
		.nullable()
		.default([]), // Default to an empty array
	securedFinancing: z
		.string()
		.nullable()
		.default(null)
		.refine((val) => val !== null && val.trim() !== '', {
			message: 'Please indicate if you have secured any financing.'
		}),
	howDidYouLearnKoredor: z
		.string()
		.nullable()
		.default(null)
		.refine((val) => val !== null && val.trim() !== '', {
			message: 'Please let us know how you learned about Koredor.'
		})
});

export const profileFormSchema = z.object({
	id: z.string(),
	idPicture: z.string().nullish(),
	idType: z
		.string({
			required_error: 'ID Type is required.'
		})
		.min(1, 'ID Type is required.'),
	idNumber: z
		.string({
			required_error: 'ID Number is required.'
		})
		.min(1, 'ID Number is required.'),
	idExpiry: z.string().nullish(),
	title,
	dob,
	firstName,
	middleName,
	lastName,
	email,
	mobile,
	address,
	province,
	city,
	barangay,
	maritalStatus,
});
