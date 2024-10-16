<script>
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginFormSchema } from '$lib/schemas/profile';
	import * as Form from '$lib/components/ui/form';
	import Label from '../ui/label/label.svelte';
	import Button from '../ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import { Input } from '../ui/input';
	import { Icons } from '../ui/icons';
	import { cn } from '$lib/utils';
	import { toast } from 'svelte-sonner';

	let className = "";
	export { className as class };
	export let isLoading = false;
	export let showPassword = false;

	
	/**
	 * @type {string | null}
	 */
	let errorMsgLogin = null;

	let data = $$props;
	const form = superForm(data, {
		validators: zodClient(loginFormSchema),
		onSubmit: () => {
			errorMsgLogin = null;
			isLoading = true;
		},
		onResult: async (result) => {
			isLoading = false;
			const { result: formResult } = result;
			if( formResult.type === "success" ){
				await goto('/dashboard');
			}else{
				errorMsgLogin = "You have provided an incorrect email or password. Please try again.";
				toast.error( "You have provided an incorrect email or password. Please try again." )
			}
		}
	});

	const { form: formData, enhance } = form;

	const togglePasswordVisibility = () => {
		showPassword = !showPassword;
	};
</script>

{#if errorMsgLogin}
	<div class="p-5 bg-red-200 text-red-900">
		{errorMsgLogin}
	</div>
{/if}

<div class={cn('grid gap-6', className)} {...$$restProps}>
	<form method="POST" class="grid gap-2" use:enhance action="?/signInWithEmail">
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
				<div class="flex items-center w-full max-w-sm space-x-2">
					<Input
						{...attrs}
						bind:value={$formData.password}
						type={showPassword ? 'text' : 'password'}
					/>
					<Button
						type="button"
						class={cn(
							'disabled:pointer-events-none disabled:opacity-50',
							'bg-secondary text-secondary-foreground hover:bg-secondary/80',
							 
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
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button disabled={isLoading} class="text-white bg-orange-700">
			{#if isLoading}
				<Icons.loaderPinwheel class="animate-spin"/>
			{:else}
				Sign In with Email
			{/if}
		</Form.Button>
		<p class="text-center text-gray-600">
			<button
				on:click={() => goto('/login/forgot-password')}
				class="text-blue-500 underline bg-transparent border-none hover:text-blue-700 focus:outline-none"
			>
				Forgot your password?
			</button>
		</p>
	</form>
</div>
