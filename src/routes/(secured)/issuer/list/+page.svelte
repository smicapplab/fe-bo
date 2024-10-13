<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import DataTable from '$lib/components/ui/data-table/data-table.svelte';
	import FilterPopover from '$lib/components/ui/filter-popover/filter-popover.svelte';
	import { Icons } from '$lib/components/ui/icons';
	import Input from '$lib/components/ui/input/input.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { issuerStatus } from '$lib/data/issuer-status.js';
	import { isBrowser } from '@supabase/ssr';
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let keyword = writable(null);
	let filterdStatus = writable([]);
	let issuers = writable([]);

	// Fetch issuers from the API
	const fetchIssuer = async () => {
		if (isBrowser()) {
			const response = await fetch('/api/issuer/list', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					filter: {
						keyword: $keyword,
						status: $filterdStatus
					}
				})
			});
			if (response.ok) {
				const data = await response.json();
				issuers.set(data);
			} else {
				console.error('Search failed');
			}
		}
	};

	// Manual search triggered by button click
	const doSearch = async () => {
		await fetchIssuer(); // Trigger search when the button is clicked
	};

	// Function to capture the 'Enter' key globally
	const handleGlobalKeydown = (event) => {
		if (event.key === 'Enter') {
			doSearch(); // Call the search function when Enter is pressed globally
		}
	};

	// Optionally, you can load initial data on mount if necessary
	onMount(() => {
		// Add the event listener for the 'keydown' event
		window.addEventListener('keydown', handleGlobalKeydown);

		fetchIssuer(); // Fetch initial data when the component mounts
	});

	onDestroy(() => {
		if (isBrowser()) {
			// Clean up the event listener when the component is destroyed
			window.removeEventListener('keydown', handleGlobalKeydown);
		}
	});
</script>

<div class="space-y-6">
	<div>
		<h3 class="mb-3 text-lg font-medium">Search</h3>
		<div class="flex items-center justify-between">
			<div class="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter tasks..."
					class="h-8 w-[150px] lg:w-[250px]"
					type="search"
					bind:value={$keyword}
				/>
				<FilterPopover bind:filterValues={$filterdStatus} title="Status" options={issuerStatus} />
				<Button class="h-8 w-[100px]" on:click={doSearch}
					>Search <Icons.search class="h-4" /></Button
				>
			</div>
		</div>
	</div>
	<Separator />
	{#if $issuers && $issuers.length > 0}
		<DataTable data={$issuers} />
	{/if}
</div>
