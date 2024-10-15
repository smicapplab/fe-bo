<script>
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { Icons } from '$lib/components/ui/icons';
	import { Toaster } from '$lib/components/ui/sonner';
	import { isLoading } from '$lib/stores/loading';
	import '../app.css';

	beforeNavigate(() => {
		isLoading.set(true); // Show loading animation before navigation
	});

	afterNavigate(() => {
		isLoading.set(false); // Hide loading animation after navigation
	});
</script>

{#if $isLoading}
	<div class="flex h-screen items-center justify-center">
		<Icons.spinner class="h-20 w-20 animate-spin" />
	</div>
{/if}

<Toaster />
<slot />
