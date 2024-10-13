import { z } from 'zod';

export const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export const mobileRegex = /^\d{10,}$/;

export const password = z
	.string()
	.min(8, 'Password must be at least 8 characters long')
	.max(50, 'Password must be less than 50 characters long')
	.refine((val) => passwordRegex.test(val), {
		message:
			'Password must include at least 1 upper case letter, 1 lower case letter, 1 number, and 1 special character'
	});

export const mobile = z.string().refine((val) => mobileRegex.test(val), {
	message: 'Mobile number must be at least 10 numeric digits'
});

export const maritalStatus = z
	.string({
		required_error: 'Marital Status is required.'
	})
	.min(1, 'Marital Status is required.');

export const title = z
	.string({
		required_error: 'To ensure we address you properly, please choose a title.'
	})
	.min(1, 'To ensure we address you properly, please choose a title.');

export const fullName = z
	.string({
		required_error: 'Kindly provide your full name so we can address you properly.'
	})
	.min(1, 'Kindly provide your full name so we can address you properly.');

export const email = z
	.string({
		required_error: 'Email is required.'
	})
	.email('Please enter a valid email address so we can reach you.');

export const firstName = z
	.string({
		required_error: 'First Name is required.'
	})
	.min(1, 'Please enter your first name');

export const lastName = z
	.string({
		required_error: 'Last Name is required.'
	})
	.min(1, 'Please enter your last name');

export const middleName = z
	.string({
		required_error: 'Middle Name is required.'
	})
	.min(1, 'Please enter your middle name');

export const address = z
	.string({
		required_error: 'Address is required.'
	})
	.min(1, 'Please enter your address');

export const province = z
	.string({
		required_error: 'Please select your province.'
	})
	.min(1, 'Please select your province.');

export const city = z
	.string({
		required_error: 'Please select your city.'
	})
	.min(1, 'Please select your city.');

export const barangay = z
	.string({
		required_error: 'Please select your barangay.'
	})
	.min(1, 'Please select your barangay.');

export const dob = z
	.string({
		required_error: 'Birthday is required.',
		invalid_type_error: 'Birthday is required.'
	})
	.min(1, 'Birthday is required.');

export const companyType = z
	.string({
		required_error: 'Company Type is required.'
	})
	.min(1, 'Company Type is required.');

export const companyName = z
	.string({
		required_error: 'Company Name is required.'
	})
	.min(1, 'Company Name is required.');

export const companyDescription = z
	.string({
		required_error: 'Provide a brief and accurate description of your company.'
	})
	.min(1, 'Provide a brief and accurate description of your company.');

export const website = z
	.string({
		required_error: 'Website URL is required'
	})
	.min(1, 'Website URL cannot be empty')
	.regex(
		/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/[^\s]*)?(\?[^\s]*)?$/,
		'Invalid website URL format'
	);

export const bir = z
	.string({
		required_error: 'Business Tax Identification Number/TIN is required'
	})
	.min(1, 'Business Tax Identification Number/TIN is required');

export const hasLending = z
	.boolean()
	.default(true)
	.refine((val) => typeof val === 'boolean', {
		message: 'Please indicate if you have a lending relationship with a financial institution.'
	});

export const hasVotingPower = z.boolean().nullable(); // Allow null

export const isAuthorizedSignatory = z
	.boolean()
	.default(true)
	.refine((val) => typeof val === 'boolean', {
		message: 'Please indicate if the person is an authorized signatory.'
	});

export const registrationDate = z
	.string({
		required_error: 'Registration Date is required.',
		invalid_type_error: 'Registration Date is required.'
	})
	.min(1, 'Registration Date is required.');

export const employeeCount = z.number({
	required_error: 'Employee count is required'
});

export const companyId = z.number().nullish();

export const industry = z
	.string({
		required_error: 'Please select an industry'
	})
	.min(1, 'Please select an industry');

export const subIndustry = z
	.string({
		required_error: 'Please select a sub-industry'
	})
	.min(1, 'Please select a sub-industry');

export const composition = z
	.string({
		required_error: 'Please select a business composition that best describes your company.'
	})
	.min(1, 'Please select a business composition that best describes your company.');

export const condition = z
	.string({
		required_error: 'Please select the condition that best describes your company.'
	})
	.min(1, 'Please select the condition that best describes your company.');

export const model = z
	.string({
		required_error: 'Please select a business model that best fits your company.'
	})
	.min(1, 'Please select a business model that best fits your company.');

export const shareholderType = z
	.string({
		required_error: 'Please select a shareholder type.'
	})
	.min(1, 'Please select a shareholder type.');

export const position = z
	.string({
		required_error: 'Kindly select position.'
	})
	.min(1, 'It looks like you missed selecting a company position.');

export const companyFunction = z
	.string({
		required_error: 'Kindly select function.'
	})
	.min(1, 'It looks like you missed selecting a company function.');

export const ownership = z.number({
	required_error: 'Please select ownership percentage.'
});

export const nationality = z
	.string({
		required_error: 'Please select nationality'
	})
	.min(1, 'Please select nationality.');

export const employmentHistorySchema = z.object({
	position,
	companyName,
	isCurrentEmployer: z.boolean().default(false),
	fromDate: z.string().min(1, 'Start date is required.'),
	toDate: z.string().nullable() // 'to' can be null
});
