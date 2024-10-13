<script>
	import SidebarNav from '$lib/components/ui/sidebar-nav/sidebar-nav.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	const sidebarNavItems = [
		{
			title: 'Issuers',
			href: '/issuer/list',
		},
		{
			title: 'Issuer Request',
			href: '/issuer/requests',
		},
	];
</script>

<div>
	<div class="p-10 pb-16 space-y-6 md:block">
		<div class="space-y-0.5">
			<h2 class="text-2xl font-bold tracking-tight text-primary">Issuer Management</h2>
		</div>
		<Separator class="my-6" />
		<div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
			<aside class="-mx-4 lg:w-1/5">
				<SidebarNav items={sidebarNavItems}/>
			</aside>
			<div class="flex-1">
				<slot />
			</div>
		</div>
	</div>
</div>
