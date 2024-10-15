<script>
	import SidebarNav from '$lib/components/ui/sidebar-nav/sidebar-nav.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	const sidebarNavItems = [
		{
			title: 'Users',
			href: '/admin/users/list'
		},
		{
			title: 'Add User',
			href: '/admin/users/create'
		}
	];
</script>

<div>
	<div class="space-y-6 p-10 pb-16 md:block">
		<div class="space-y-0.5">
			<h2 class="text-2xl font-bold tracking-tight text-primary">System Administration</h2>
		</div>
		<Separator class="my-6" />
		<div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
			<aside class="-mx-4 lg:w-1/5">
				<SidebarNav items={sidebarNavItems} />
			</aside>
			<div class="flex-1">
				<slot />
			</div>
		</div>
	</div>
</div>
