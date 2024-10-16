<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updateProfileSchema } from '$lib/schemas/profile';
	import { Icons } from '$lib/components/ui/icons';
	import { toast } from 'svelte-sonner';

	let isLoading = false;
	export let data;

	const form = superForm(data.form, {
		dataType: 'json',
		// @ts-ignore
		validators: zodClient(updateProfileSchema),
		onSubmit: () => {
			isLoading = true;
		},
		onResult: async (result) => {
			isLoading = false;
			const { result: formResult } = result;
            if (formResult.type === 'success') {
			    formProfileData.set({
                    ...$formProfileData,
                });
                toast.success("Your Profile has been successfully saved!")
            }
		},
        applyAction: false,  // Add this line to prevent page reload
		resetForm: false,
        invalidateAll: false    // Optional: prevent form reset after submission
	});

	const { form: formProfileData, enhance } = form;
</script>

<form method="POST" use:enhance class="space-y-8" id="profile-form" action="?/saveProfile" on:submit|preventDefault>
	<Card.Root class="mx-auto w-full max-w-lg">
		<Card.Header>
			<Card.Title class="text-2xl">My Profile</Card.Title>
			<Card.Description>Update Your Koredor Profile</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<Form.Field {form} name="firstName">
				<Form.Control let:attrs>
					<Form.Label>First Name</Form.Label>
					<Input bind:value={$formProfileData.firstName} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="middleName">
				<Form.Control let:attrs>
					<Form.Label>Middle Name</Form.Label>
					<Input bind:value={$formProfileData.middleName} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="lastName">
				<Form.Control let:attrs>
					<Form.Label>Last Name</Form.Label>
					<Input bind:value={$formProfileData.lastName} />
				</Form.Control>
                <Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email/Username</Form.Label>
					<Input bind:value={$formProfileData.email} disabled />
				</Form.Control>
                <Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="mobile">
				<Form.Control let:attrs>
					<Form.Label>Mobile</Form.Label>
					<Input bind:value={$formProfileData.mobile} />
				</Form.Control>
                <Form.FieldErrors />
			</Form.Field>
		</Card.Content>
		<Card.Footer>
			<Form.Button disabled={isLoading} class="min-w-40 bg-primary">
				{#if isLoading}
					<Icons.loaderPinwheel class="animate-spin" />
				{:else}
					Save <Icons.save class="ml-2" />
				{/if}
			</Form.Button>
		</Card.Footer>
	</Card.Root>
</form>
