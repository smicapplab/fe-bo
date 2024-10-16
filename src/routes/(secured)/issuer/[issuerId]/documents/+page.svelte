<script>
	import { page } from '$app/stores';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Gis from './(components)/(forms)/gis.svelte';
	import Sec from './(components)/(forms)/sec.svelte';
	import Mp from './(components)/(forms)/mp.svelte';
	import Aoi from './(components)/(forms)/aoi.svelte';
	import Dti from './(components)/(forms)/dti.svelte';
	import Aof from './(components)/(forms)/aof.svelte';
	import Aop from './(components)/(forms)/aop.svelte';

	/**
	 * @typedef {'SOLE' | 'CORP' | 'PART' | 'OPC'} CompanyType
	 */

	/**
	 * An object mapping company type codes to their full names.
	 * @type {{ SOLE: string; CORP: string; PART: string; OPC: string }}
	 */
	const companyTypes = {
		SOLE: 'Sole Proprietorship',
		CORP: 'Corporation',
		PART: 'Partnership',
		OPC: 'One Person Corporation (OPC)'
	};

	let { company } = $page.data;
	/**
	 * The current company type.
	 * @type {CompanyType}
	 */
	$: companyType = company.companyType;
	$: companyId = company.id;
	$: companyCode = company.code;
</script>

<div class="space-y-6">
	<h3 class="text-lg font-medium">Supporting Documents for {companyTypes[companyType]}</h3>
	<Separator />

	{#if companyType === 'CORP'}
		<Gis {companyId} {companyCode} />
		<Sec {companyId} {companyCode} />
		<Sec docType="SECAMEND" {companyId} {companyCode} />
		<Mp {companyId} {companyCode} />
		<Aoi {companyId} {companyCode} />
	{:else if companyType === 'SOLE'}
		<Dti {companyId} {companyCode} />
		<Mp {companyId} {companyCode} />
	{:else if companyType === 'OPC'}
		<Aof {companyId} {companyCode} />
		<Sec {companyId} {companyCode} />
		<Sec docType="SECAMEND" {companyId} {companyCode} />
		<Mp {companyId} {companyCode} />
		<Aoi {companyId} {companyCode} />
	{:else if companyType === 'PART'}
		<Sec {companyId} {companyCode} />
		<Sec docType="SECAMEND" {companyId} {companyCode} />
		<Mp {companyId} {companyCode} />
		<Aop {companyId} {companyCode} />
	{/if}
</div>
