<script>
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { cn } from '$lib/utils';
	import { companyInfoFormSchema } from '$lib/schemas/companyInfo.js';
	import { isBrowser } from '@supabase/ssr';
	import { writable } from 'svelte/store';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { getSelectedOption } from '$lib/data/lov.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { CalendarIcon } from 'lucide-svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date';
	import AdvancedCalendar from '$lib/components/ui/calendar/advanced-calendar.svelte';
	import { fetchBarangaysByCities, fetchCitiesByProvince, fetchProvinces } from '$lib/data/geo.js';
	import { onMount } from 'svelte';
	import { Icons } from '$lib/components/ui/icons/index.js';
	import { toast } from 'svelte-sonner';

	export let data;
	let isLoading = false;

	const {
		companyTypesOptions,
		compositionOptions,
		employeeCountOptions,
		industriesOptions,
		conditionOptions,
		modelOptions
	} = data;

	let subIndustryOptions = writable([]);
	/**
	 * @type {any[]}
	 */
	let provinceOptions = [];
	let citiesOptions = writable([]);
	let barangayOptions = writable([]);

	const form = superForm(data.form, {
		dataType: 'json',
		// @ts-ignore
		validators: zodClient(companyInfoFormSchema),
		onSubmit: () => {
			isLoading = true;
		},
		onResult: async (result) => {
			isLoading = false;
			const { result: formResult } = result;
			if (formResult.type === 'success') {
				if (isBrowser()) {
					toast.success("Company Information has been successfully saved!")
					formData.set(formResult.data);
				}
			}
		},
		applyAction: false,  // Add this line to prevent page reload
		resetForm: false,
        invalidateAll: false    // Optional: prevent form reset after submission
	});

	const { form: formData, enhance, errors } = form;
	// Get today's date
	const currentDate = today(getLocalTimeZone());

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	const industryChanged = (/** @type {{ value: any; }} */ event) => {
		$formData.industry = event.value;
		$formData.subIndustry = '';
		resolveSubIndustry();
	};

	const resolveSubIndustry = () => {
		if ($formData.industry) {
			const subIndustries =
				industriesOptions.find(
					(/** @type {{ value: any; }} */ industry) => industry.value === $formData.industry
				)?.sub || [];
			subIndustryOptions.set(subIndustries);
		}
	};

	const onSelectProvince = async (event) => {
		$formData.province = event.value;
		$formData.city = '';
		$formData.barangay = '';
		await resolveCities();
		barangayOptions.set([]);
	};

	const resolveCities = async () => {
		if ($formData.province) {
			const newCities = await fetchCitiesByProvince($formData.province);
			citiesOptions.set(newCities || []);
		}
	};

	const onSelectCity = async (event) => {
		$formData.city = event.value;
		$formData.barangay = '';
		await resolveBarangays();
	};

	const resolveBarangays = async () => {
		if ($formData.city) {
			const newBarangays = await fetchBarangaysByCities($formData.province, $formData.city);
			barangayOptions.set(newBarangays || []);
		}
	};

	onMount(async () => {
		if (isBrowser()) {
			provinceOptions = await fetchProvinces();
			await resolveCities();
			await resolveBarangays();

			resolveSubIndustry();
		}
	});
</script>

<div class="space-y-6">
	<h2 class="font-semibold">Company Information</h2>
	<form
		method="POST"
		use:enhance
		class="max-w-md space-y-8"
		id="profile-form"
		action="?/saveCompany"
	>
		<Form.Field {form} name="companyType">
			<Form.Control let:attrs>
				<Form.Label>Company Type</Form.Label>
				<Select.Root
					selected={getSelectedOption(companyTypesOptions, $formData.companyType)}
					onSelectedChange={(v) => {
						v && ($formData.companyType = v.value);
					}}
				>
					<Select.Trigger {...attrs} class="max-w-80">
						<Select.Value />
					</Select.Trigger>
					<Select.Content class="select-content">
						{#each companyTypesOptions as { label, value }}
							<Select.Item {value}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.companyType} name={attrs.name} />
			</Form.Control>
		</Form.Field>

		<Form.Field {form} name="companyName">
			<Form.Control let:attrs>
				<Form.Label>Company Name</Form.Label>
				<Input bind:value={$formData.companyName} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="companyDescription">
			<Form.Control let:attrs>
				<Form.Label>Company Description</Form.Label>
				<Textarea
					{...attrs}
					class="resize-none"
					rows="5"
					bind:value={$formData.companyDescription}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="website">
			<Form.Control let:attrs>
				<Form.Label>Company Website</Form.Label>
				<Input bind:value={$formData.website} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>Company Email</Form.Label>
				<Input bind:value={$formData.email} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="mobile">
			<Form.Control let:attrs>
				<Form.Label>Mobile Number</Form.Label>
				<Input bind:value={$formData.mobile} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="bir">
			<Form.Control let:attrs>
				<Form.Label>Business Tax Identification Number</Form.Label>
				<Input bind:value={$formData.bir} />
			</Form.Control>
			<Form.Description
				>Business Tax Identification Number for Corporation and Personal TIN for Sole Prop</Form.Description
			>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="hasLending" class="flex flex-row items-center justify-between">
			<Form.Control let:attrs>
				<div class="space-y-0.5">
					<Form.Label class="overflow-auto">Has Lending Relationship with a Bank?</Form.Label>
					<Form.Description class="text-sm text-secondary"
						>{$formData.hasLending ? 'Yes' : 'No'}</Form.Description
					>
				</div>
				<Switch includeInput {...attrs} bind:checked={$formData.hasLending} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="registrationDate" class="mb-6 flex flex-col">
			<Form.Control let:attrs>
				<Form.Label>Date Of Establishment</Form.Label>
				<Popover.Root>
					<Popover.Trigger
						{...attrs}
						class={cn(
							buttonVariants({ variant: 'outline' }),
							'w-[280px] justify-start pl-4 text-left font-normal',
							!$formData.registrationDate && 'text-muted-foreground'
						)}
					>
						{$formData.registrationDate
							? df.format(parseDate($formData.registrationDate).toDate(getLocalTimeZone()))
							: 'Pick a date'}
						<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" side="top">
						<AdvancedCalendar
							minValue={currentDate.subtract({ years: 200 })}
							maxValue={currentDate.subtract({ years: 1 })}
							calendarLabel="Date of birth"
							initialFocus
							onValueChange={(v) => {
								if (v) {
									$formData.registrationDate = v.toString();
								} else {
									$formData.registrationDate = '';
								}
							}}
						/>
					</Popover.Content>
				</Popover.Root>
				<Form.FieldErrors />
				<input hidden bind:value={$formData.registrationDate} name={attrs.name} />
			</Form.Control>
		</Form.Field>

		<Form.Field {form} name="employeeCount">
			<Form.Control let:attrs>
				<Form.Label>Employee Count</Form.Label>
				<Select.Root
					selected={getSelectedOption(employeeCountOptions, $formData.employeeCount)}
					onSelectedChange={(v) => {
						v && ($formData.employeeCount = v.value);
					}}
				>
					<Select.Trigger {...attrs} class="max-w-80">
						<Select.Value />
					</Select.Trigger>
					<Select.Content class="select-content">
						{#each employeeCountOptions as { label, value }}
							<Select.Item {value}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.employeeCount} name={attrs.name} />
			</Form.Control>
		</Form.Field>

		<Form.Field {form} name="industry">
			<Form.Control let:attrs>
				<Form.Label>Industry</Form.Label>
				<Select.Root
					selected={getSelectedOption(industriesOptions, $formData.industry)}
					onSelectedChange={industryChanged}
				>
					<Select.Trigger {...attrs} class="max-w-96">
						<Select.Value />
					</Select.Trigger>
					<Select.Content class="select-content">
						{#each industriesOptions as { label, value }}
							<Select.Item {value}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.industry} name={attrs.name} />
			</Form.Control>
		</Form.Field>

		<Form.Field {form} name="subIndustry">
			<Form.Control let:attrs>
				<Form.Label>Sub Industry</Form.Label>
				<Select.Root
					selected={getSelectedOption($subIndustryOptions, $formData.subIndustry)}
					onSelectedChange={(v) => {
						v && ($formData.subIndustry = v.value);
					}}
				>
					<Select.Trigger {...attrs} class="max-w-96">
						<Select.Value />
					</Select.Trigger>
					<Select.Content class="select-content">
						{#each $subIndustryOptions as { label, value }}
							<Select.Item {value}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.subIndustry} name={attrs.name} />
			</Form.Control>
		</Form.Field>

		<Form.Field {form} name="condition">
			<Form.Control let:attrs>
				<Form.Label>Which best describes the condition of your company?</Form.Label>
				<Select.Root
					selected={getSelectedOption(conditionOptions, $formData.condition)}
					onSelectedChange={(v) => {
						v && ($formData.condition = v.value);
					}}
				>
					<Select.Trigger {...attrs}>
						<Select.Value />
					</Select.Trigger>
					<Select.Content class="select-content">
						{#each conditionOptions as { label, value }}
							<Select.Item {value}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.condition} name={attrs.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="composition">
			<Form.Control let:attrs>
				<Form.Label>Who comprises the senior management of your company?</Form.Label>
				<Select.Root
					selected={getSelectedOption(compositionOptions, $formData.composition)}
					onSelectedChange={(v) => {
						v && ($formData.composition = v.value);
					}}
				>
					<Select.Trigger {...attrs}>
						<Select.Value />
					</Select.Trigger>
					<Select.Content class="select-content">
						{#each compositionOptions as { label, value }}
							<Select.Item {value}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.composition} name={attrs.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="model">
			<Form.Control let:attrs>
				<Form.Label>Which of the following best describes your business model?</Form.Label>
				<Select.Root
					selected={getSelectedOption(modelOptions, $formData.model)}
					onSelectedChange={(v) => {
						v && ($formData.model = v.value);
					}}
				>
					<Select.Trigger {...attrs}>
						<Select.Value />
					</Select.Trigger>
					<Select.Content class="select-content">
						{#each modelOptions as { label, value }}
							<Select.Item {value}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.model} name={attrs.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="rounded-lg border p-4">
			<Form.Field {form} name="address">
				<Form.Control let:attrs>
					<Form.Label>Company Address</Form.Label>
					<Input bind:value={$formData.address} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="province">
				<Form.Control let:attrs>
					<Form.Label>Province</Form.Label>
					<Select.Root
						selected={getSelectedOption(provinceOptions, $formData.province)}
						onSelectedChange={onSelectProvince}
					>
						<Select.Trigger {...attrs}>
							<Select.Value />
						</Select.Trigger>
						<Select.Content class="select-content">
							{#each provinceOptions as { label, value }}
								<Select.Item {value}>{label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.province} name={attrs.name} />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="city">
				<Form.Control let:attrs>
					<Form.Label>City/Municipality</Form.Label>
					<Select.Root
						selected={getSelectedOption($citiesOptions, $formData.city)}
						onSelectedChange={onSelectCity}
					>
						<Select.Trigger {...attrs}>
							<Select.Value />
						</Select.Trigger>
						<Select.Content class="select-content">
							{#each $citiesOptions || [] as { label, value }}
								<Select.Item {value}>{label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.city} name={attrs.name} />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="barangay">
				<Form.Control let:attrs>
					<Form.Label>Barangay</Form.Label>
					<Select.Root
						selected={getSelectedOption($barangayOptions, $formData.barangay)}
						onSelectedChange={(v) => {
							v && ($formData.barangay = v.value);
						}}
					>
						<Select.Trigger {...attrs}>
							<Select.Value />
						</Select.Trigger>
						<Select.Content class="select-content">
							{#each $barangayOptions || [] as { label, value }}
								<Select.Item {value}>{label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.barangay} name={attrs.name} />
				</Form.Control>
			</Form.Field>
		</div>
		<div class="py-5">
			<Form.Button disabled={isLoading} class="min-w-40 bg-primary">
				{#if isLoading}
					<Icons.loaderPinwheel class="animate-spin" />
				{:else}
					Save <Icons.save class="ml-2" />
				{/if}
			</Form.Button>
		</div>
	</form>
</div>

<style>
	/* You might need to adjust the selector based on your UI library's class names */
	:global(.select-content) {
		max-height: 500px;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: #888 #f1f1f1;
	}

	:global(.select-content::-webkit-scrollbar) {
		width: 6px;
	}

	:global(.select-content::-webkit-scrollbar-track) {
		background: #f1f1f1;
	}

	:global(.select-content::-webkit-scrollbar-thumb) {
		background: #888;
		border-radius: 4px;
	}

	:global(.select-content::-webkit-scrollbar-thumb:hover) {
		background: #555;
	}
</style>
