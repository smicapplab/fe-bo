<script>
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { profileFormSchema } from '$lib/schemas/profile.js';
	import { DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date';
	import { writable } from 'svelte/store';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { getSelectedOption } from '$lib/data/lov.js';
	import { fetchBarangaysByCities, fetchCitiesByProvince, fetchProvinces } from '$lib/data/geo.js';
	import { onMount } from 'svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { CalendarIcon } from 'lucide-svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import AdvancedCalendar from '$lib/components/ui/calendar/advanced-calendar.svelte';
	import { Icons } from '$lib/components/ui/icons';
	import { cn } from '$lib/utils.js';
	import { toast } from 'svelte-sonner';

	export let data;
	let isLoading = false;
	let isImgLoading = false;

	const { maritalStatusOptions, idTypeOptions, titleOptions, profile } = data;

	/**
	 * @type {any[]}
	 */
	let provinceOptions = [];
	let citiesOptions = writable([]);
	let barangayOptions = writable([]);

	//$: initialData = $page.form ? $page.form?.data : data.form?.data;
	const form = superForm(data.form, {
		dataType: 'json',
		// @ts-ignore
		validators: zodClient(profileFormSchema),
		onSubmit: () => {
			isLoading = true;
		},
		onResult: async (result) => {
			isLoading = false;
			const { result: formResult } = result;
			if (formResult.type === 'success') {
				formData.update(formResult.data);
				toast.success("Your Personal Information has been successfully saved!")
			}
		},
		applyAction: false,  // Add this line to prevent page reload
		resetForm: false,
        invalidateAll: false    // Optional: prevent form reset after submission
	});

	const { form: formData, enhance, errors } = form;
	// $: if ($errors && Object.keys($errors).length > 0) {
	// 	console.log('New errors:', $errors);
	// }

	// Get today's date
	const currentDate = today(getLocalTimeZone());

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	const handleFileChange = async (event) => {
		try {
			isImgLoading = true;
			const file = event.target.files[0];
			if (file) {
				const { name } = file;
				const reader = new FileReader();
				reader.onload = async () => {
					// Set the Base64 string to the form data
					// $formData.idPicture = reader.result;

					const response = await fetch(`/api/profile/${profile.id}/upload-id`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							type: 'AOF',
							name,
							data: reader.result
						})
					});

					if (response.ok) {
						// isReload.set(true);
						const data = await response.json();
						formData.set({
							...$formData,
							idPicture: data.idPicture
						});
					}
				};
				reader.readAsDataURL(file);
			}
		} catch (error) {
			console.error(error);
		} finally {
			isImgLoading = false;
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
		provinceOptions = await fetchProvinces();
		await resolveCities();
		await resolveBarangays();
	});
</script>

<div class="space-y-6">
	<form method="POST" use:enhance id="profile-form" action="?/savePersonal">
		<div class="space-y-4 max-w-md">
			<Form.Field {form} name="title">
				<Form.Control let:attrs>
					<Form.Label>Title</Form.Label>
					<Select.Root
						selected={getSelectedOption(titleOptions, $formData.title)}
						onSelectedChange={(v) => {
							v && ($formData.title = v.value);
						}}
					>
						<Select.Trigger {...attrs} class="max-w-36">
							<Select.Value />
						</Select.Trigger>
						<Select.Content class="select-content">
							{#each titleOptions as { value, label }}
								<Select.Item {value}>{label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.title} name={attrs.name} />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="firstName">
				<Form.Control let:attrs>
					<Form.Label>First Name</Form.Label>
					<Input bind:value={$formData.firstName} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="middleName">
				<Form.Control let:attrs>
					<Form.Label>Middle Name</Form.Label>
					<Input bind:value={$formData.middleName} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="lastName">
				<Form.Control let:attrs>
					<Form.Label>Last Name</Form.Label>
					<Input bind:value={$formData.lastName} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="maritalStatus">
				<Form.Control let:attrs>
					<Form.Label>Marital Status</Form.Label>
					<Select.Root
						selected={getSelectedOption(maritalStatusOptions, $formData.maritalStatus)}
						onSelectedChange={(v) => {
							v && ($formData.maritalStatus = v.value);
						}}
					>
						<Select.Trigger {...attrs} class="max-w-36">
							<Select.Value />
						</Select.Trigger>
						<Select.Content class="select-content">
							{#each maritalStatusOptions as { value, label }}
								<Select.Item {value}>{label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.maritalStatus} name={attrs.name} />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
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

			<Form.Field {form} name="address">
				<Form.Control let:attrs>
					<Form.Label>Home Address</Form.Label>
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
					<Form.Label>City/District</Form.Label>
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

			<Form.Field {form} name="dob" class="mb-6 flex flex-col">
				<Form.Control let:attrs>
					<Form.Label>Birthday</Form.Label>
					<Popover.Root>
						<Popover.Trigger
							{...attrs}
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'w-[280px] justify-start pl-4 text-left font-normal',
								!$formData.dob && 'text-muted-foreground'
							)}
						>
							{$formData.dob
								? df.format(parseDate($formData.dob).toDate(getLocalTimeZone()))
								: 'Pick a date'}
							<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" side="top">
							<AdvancedCalendar
								minValue={currentDate.subtract({ years: 100 })}
								maxValue={currentDate.subtract({ years: 10 })}
								calendarLabel="Date of birth"
								initialFocus
								onValueChange={(v) => {
									if (v) {
										$formData.dob = v.toString();
									} else {
										$formData.dob = '';
									}
								}}
							/>
						</Popover.Content>
					</Popover.Root>
					<Form.FieldErrors />
					<input hidden bind:value={$formData.dob} name={attrs.name} />
				</Form.Control>
			</Form.Field>
		</div>

		<div class="rounded-lg border p-4 lg:max-w-2xl mt-5">
			<h3 class="py-5 text-lg font-medium">Identification Card (ID)</h3>
			<div class="mb-6 gap-1 lg:grid lg:grid-cols-2">
				<div>
					<Form.Field {form} name="idPicture">
						<Form.Control let:attrs>
							<Form.Label>Valid ID Photo</Form.Label>
							{#if isImgLoading}
								<div class="flex w-full animate-pulse justify-center align-middle text-primary">
									<span class="mr-1 animate-pulse">Uploading</span>
									<Icons.loaderPinwheel class="h-6 w-6 animate-spin" />
								</div>
							{:else}
								<Input id="picture" type="file" on:change={handleFileChange} />
							{/if}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="flex overflow-hidden rounded-md pt-8 lg:justify-end">
					{#if !isImgLoading && $formData.idPicture}
						<img
							class={cn(
								'h-auto w-auto object-cover transition-all hover:scale-105',
								`w-auto`,
								`h-36`
							)}
							src={$formData.idPicture}
							alt="identification-card"
						/>
					{/if}
				</div>
			</div>
			<div class="space-y-4 max-w-md">
				<Form.Field {form} name="idType">
					<Form.Control let:attrs>
						<Form.Label>ID Type</Form.Label>
						<Select.Root
							selected={getSelectedOption(idTypeOptions, $formData.idType)}
							onSelectedChange={(v) => {
								v && ($formData.idType = v.value);
							}}
						>
							<Select.Trigger {...attrs}>
								<Select.Value />
							</Select.Trigger>
							<Select.Content class="select-content">
								{#each idTypeOptions as { value, label }}
									<Select.Item {value}>{label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						<input hidden bind:value={$formData.idType} name={attrs.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="idNumber">
					<Form.Control let:attrs>
						<Form.Label>ID Number</Form.Label>
						<Input bind:value={$formData.idNumber} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="idExpiry" class="mb-6 flex flex-col">
					<Form.Control let:attrs>
						<Form.Label>ID Expiry Date</Form.Label>
						<Popover.Root>
							<Popover.Trigger
								{...attrs}
								class={cn(
									buttonVariants({ variant: 'outline' }),
									'w-[280px] justify-start pl-4 text-left font-normal',
									(!$formData.idExpiry || !parseDate($formData.idExpiry)) && 'text-muted-foreground'
								)}
							>
								{$formData.idExpiry
									? df.format(parseDate($formData.idExpiry).toDate(getLocalTimeZone()))
									: 'Pick a date'}
								<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0" side="top">
								<AdvancedCalendar
									value={$formData.idExpiry ? parseDate($formData.idExpiry) : undefined}
									minValue={currentDate}
									maxValue={currentDate.add({ years: 10 })}
									calendarLabel="Date of birth"
									initialFocus
									onValueChange={(v) => {
										if (v) {
											$formData.idExpiry = v.toString();
										} else {
											$formData.idExpiry = '';
										}
									}}
								/>
							</Popover.Content>
						</Popover.Root>
						<Form.FieldErrors />
						<input hidden value={$formData.idExpiry} name={attrs.name} />
					</Form.Control>
				</Form.Field>
			</div>
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
