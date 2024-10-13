<script>
	import UserForm from '$lib/components/forms/user-form.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { onMount } from 'svelte';

	const data = {
		roleId: 3
	};

	onMount(() => {
		// Any initialization code can go here
	});
</script>

<div class="space-y-6">
	<div>
		<h3 class="mb-3 text-lg font-medium">Create User</h3>
	</div>
	<Separator />
	<UserForm {data} />
</div>
