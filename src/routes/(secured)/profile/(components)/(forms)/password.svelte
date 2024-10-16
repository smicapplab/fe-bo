<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updatePassword } from '$lib/schemas/profile';
	import { Icons } from '$lib/components/ui/icons';
	import { toast } from 'svelte-sonner';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn, generatePassword } from '$lib/utils';

	let isLoading = false;
	let showPassword = false;

	let data = { password: null };
	const form = superForm(data, {
		dataType: 'json',
		// @ts-ignore
		validators: zodClient(updatePassword),
		onSubmit: () => {
			isLoading = true;
		},
		onResult: async (result) => {
			isLoading = false;
			const { result: formResult } = result;
			if (formResult.type === 'success') {
				toast.success('Your Password has been changed!');
                passwordData.set(data)
			}
		},
		applyAction: false,  // Add this line to prevent page reload
		resetForm: false,
		invalidateAll: false    // Optional: prevent form reset after submission
	});

	const { form: passwordData, enhance, errors } = form;

	const togglePasswordVisibility = () => {
		showPassword = !showPassword;
	};

    const handleGeneratePassword = () => {
		showPassword = true;
        passwordData.set({
            password: generatePassword()
        })
	};
</script>

<form method="POST" use:enhance class="space-y-8" id="password-form" action="?/changePassword">
	<Card.Root class="mx-auto w-full max-w-lg">
		<Card.Header>
			<Card.Title class="text-2xl">Change Password</Card.Title>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>New Password</Form.Label>
					<div class="flex w-full max-w-sm items-center space-x-2">
						<Input
							{...attrs}
							bind:value={$passwordData.password}
							type={showPassword ? 'text' : 'password'}
						/>
						<Button
							type="button"
							class={cn(
								'disabled:pointer-events-none disabled:opacity-50',
								'bg-secondary text-secondary-foreground hover:bg-secondary/80',
								data
							)}
							on:click={togglePasswordVisibility}
						>
							{#if showPassword}
								<Icons.eyeOff />
							{:else}
								<Icons.eye />
							{/if}
						</Button>
					</div>
                    <Button variant="ghost" on:click={handleGeneratePassword}>I lack imagination, make me a password!</Button>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>
		<Card.Footer>
			<Form.Button disabled={isLoading || $passwordData.password === null} class="min-w-40">
				{#if isLoading}
					<Icons.loaderPinwheel class="animate-spin" />
				{:else}
					Update Password<Icons.lock class="ml-2" />
				{/if}
			</Form.Button>
		</Card.Footer>
	</Card.Root>
</form>
