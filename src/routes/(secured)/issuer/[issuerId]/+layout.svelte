<script>
	import { formatCompanyCode } from './../../../../lib/company.js';
	import SidebarNav from '$lib/components/ui/sidebar-nav/sidebar-nav.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

	const issuerId = $page.params.issuerId;
	let company = writable(null);
	const sidebarNavItems = [
		{
			title: 'Company',
			href: `/issuer/${issuerId}/company`
		},
		{
			title: 'Person-In-Charge',
			href: `/issuer/${issuerId}/pic`
		},
		{
			title: 'Documents',
			href: `/issuer/${issuerId}/documents`
		}
	];

	onMount(async () => {
		// Any initialization code can go here
		try {
			const response = await fetch(`/api/company/${issuerId}/get`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			});

			if (response.ok) {
				const data = await response.json();
				company.set(data);
			}
		} catch (error) {
			console.error(error);
		} finally {
			//isLoading = false;
		}
	});
</script>

<div>
	<div class="space-y-6 p-10 pb-16 md:block">
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			{#if $company}
				<!-- Left grid column -->
				<h2 class="text-2xl font-bold tracking-tight text-primary">
					{$company.companyName || '--'}
				</h2>

				<!-- Right grid column with Flexbox -->
				<div class="flex lg:flex-col lg:items-end lg:justify-end">
					<div class="rounded-xl text-white border p-2 bg-slate-600">{formatCompanyCode({ code: $company.code, companyId: issuerId })}</div>
				</div>
			{:else}
				<!-- Left grid column skeleton -->
				<Skeleton class="block h-4 w-[250px]" />

				<!-- Right grid column skeleton with Flexbox -->
				<div class="flex lg:flex-col lg:items-end lg:justify-end">
					<Skeleton class="mb-2 block h-4 w-[200px]" />
					<Skeleton class="block h-4 w-[200px]" />
				</div>
			{/if}
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
