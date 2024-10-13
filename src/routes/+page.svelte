<script>
	import { assets } from '$app/paths';
	import LoginForm from '$lib/components/forms/login-form.svelte';
	// import RegistrationForm from '$lib/components/forms/registration-form.svelte';
	import { Divider } from '$lib/components/ui/divider';

	export let data;
	// @ts-ignore
	const { session } = data;
	if (session) {
		window.location.replace('/dashboard');
	}

</script>

<div
	class="relative flex min-h-screen flex-col items-center justify-center lg:grid lg:grid-cols-2 lg:px-0"
>
	<div
		class="relative hidden h-full w-full bg-muted p-10 text-white dark:border-r lg:flex lg:flex-col"
	>
		<div
			class="absolute inset-0 bg-cover"
			style="background-image: url({assets}/login-bg.jpg);"
		></div>
		<div
			class="relative z-20 flex items-center text-5xl font-bold"
			style="text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.8);"
		>
			Koredor Back Office
		</div>
	</div>
	<div class="flex w-full items-center justify-center p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div class="flex flex-col space-y-2 text-center">
					<h1 class="text-2xl font-semibold tracking-tight">Welcome Back</h1>
				</div>
				<LoginForm/>
				<Divider />
			<div class="absolute bottom-0 py-5 text-center text-sm">
				<div>
					&copy; Koredor Capital Philippines {new Date().getFullYear()}. All Rights Reserved.
				</div>
				<div>
					<a href="https://www.koredorcapital.com/terms-of-use" class="btn btn-link">Terms of Use</a
					>
					|
					<a href="https://www.koredorcapital.com/privacy-policy" class="btn btn-link"
						>Privacy Policy</a
					>
					|
					<a href="https://www.koredorcapital.com/cookie-policy" class="btn btn-link"
						>Cookie Policy</a
					>
				</div>
			</div>
		</div>
	</div>
</div>
