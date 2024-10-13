<script>
    import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { userFormSchema } from '$lib/schemas/profile';
	import * as Form from '$lib/components/ui/form';
	import Label from '../ui/label/label.svelte';
	import { Input } from '../ui/input';
	import { cn } from '$lib/utils';
	import { Icons } from '../ui/icons';

    let isLoading = false;
    export let data;

	const form = superForm(data, {
		validators: zodClient(userFormSchema),
		onSubmit: () => {
			isLoading = true;
		},
		onResult: async (result) => {
			isLoading = false;
			const { result: formResult } = result;
			// if( formResult.type === "success" ){
			// 	await goto('/dashboard');
			// }else{
			// 	toast.error( "You have provided an incorrect email or password. Please try again." )
			// }
		}
	});

    const { form: formData, enhance, errors } = form;
    // $: if ($errors && Object.keys($errors).length > 0) {
	// 	console.log('New errors:', $errors);
	// }
</script>

<div class={cn('grid gap-6 max-w-md')} {...$$restProps}>
	<form method="POST" class="grid gap-2" use:enhance action="?/saveUser">
		<Form.Field {form} name="firstName">
			<Form.Control let:attrs>
				<Label>First Name</Label>
				<Input {...attrs} bind:value={$formData.firstName} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
        <Form.Field {form} name="lastName">
			<Form.Control let:attrs>
				<Label>Last Name</Label>
				<Input {...attrs} bind:value={$formData.lastName} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
        <Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Label>Koredor Email</Label>
				<Input {...attrs} bind:value={$formData.email} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
        <Form.Field {form} name="password">
			<Form.Control let:attrs>
				<Label>Password</Label>
				<Input {...attrs} bind:value={$formData.password} type="password"/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
        <Form.Field {form} name="mobile">
			<Form.Control let:attrs>
				<Label>Mobile</Label>
				<Input {...attrs} bind:value={$formData.mobile} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
        <Form.Field {form} name="roleId">
			<Form.Control let:attrs>
				<Label>Role Id</Label>
				<Input {...attrs} bind:value={$formData.roleId} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

        <Form.Button disabled={isLoading} class="text-white bg-orange-700 w-28">
			{#if isLoading}
				<Icons.loaderPinwheel class="animate-spin"/>
			{:else}
				Save
			{/if}
		</Form.Button>
    </form>
</div>        