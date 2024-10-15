<script>
	// @ts-nocheck

	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { onMount } from 'svelte';
	import { assets } from '$app/paths';
	import { Icons } from '$lib/components/ui/icons';
	import { toast } from 'svelte-sonner';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { aofDocFormSchema } from '$lib/schemas/document';

	export let companyId;
	export let companyCode;

	let isLoading = true;
	let isImgLoading = false;

	/**
	 * @type {{ name: any; type: string; url: any; } | null}
	 */
	let selectedFile = null;
	let isModalOpen = false;

	const openModal = (/** @type {any} */ file) => {
		selectedFile = file;
		isModalOpen = true;
	};

	const closeModal = () => {
		isModalOpen = false;
	};

	const form = superForm(
		{},
		{
			dataType: 'json',
			// @ts-ignore
			validators: zodClient(aofDocFormSchema),
			onSubmit: () => {
				isLoading = true;
			},
			onResult: (result) => {
				isLoading = false;
				const { result: formResult } = result;
				if (formResult.type === 'success') {
					// @ts-ignore
					$formData.set(formResult.data);
				}
			},
			taintedMessage: null
		}
	);

	const { form: formData } = form;
	const deleteFile = async () => {
		isImgLoading = true;
		try {
			const response = await fetch(`/api/document/${companyId}/del-doc-by-type`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: 'AOF',
					selectedFile
				})
			});

			if (response.ok) {
				const data = await response.json();
				formData.set(data);
				// @ts-ignore
				toast.success(`File ${selectedFile.name} deleted successfully!`);
			}
		} catch (error) {
			console.error(error);
		} finally {
			isImgLoading = false;
			closeModal();
		}
	};

	const handleFileChange = async (/** @type {{ target: { files: any[]; }; }} */ event) => {
		const file = event.target.files[0];
		isImgLoading = true;

		try {
			if (file) {
				const { name } = file;
				const reader = new FileReader();
				reader.onload = async () => {
					const response = await fetch(`/api/document/${companyId}/upload-doc-by-type`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							type: 'AOF',
							name,
							data: reader.result,
							companyCode
						})
					});

					if (response.ok) {
						const data = await response.json();
						formData.set(data);
						toast.success(`File ${name} uploaded successfully!`);
					}
				};
				reader.readAsDataURL(file);
			}
		} catch (error) {
			console.error(error);
		} finally {
			isImgLoading = false;
		}
	};

	onMount(async () => {
		// Any initialization code can go here
		try {
			const response = await fetch(`/api/document/${companyId}/get-doc-by-type`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: 'AOF'
				})
			});

			if (response.ok) {
				const data = await response.json();
				formData.set(data);
			}
		} catch (error) {
			console.error(error);
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="rounded-lg border p-4">
	<h3 class="text-lg font-bold">Form of Appointment of Officer Files</h3>
	<p class="text-sm text-gray-700">Applicable only to Corporation type of business</p>
	{#if isLoading}
		<div class="flex flex-row space-x-2 py-5">
			<Skeleton class="h-10 w-8" /><Skeleton class="h-10 w-8" /><Skeleton class="h-10 w-8" />
		</div>
		<div class="space-y-2">
			<Skeleton class="h-4 w-[250px]" />
			<Skeleton class="h-4 w-[400px]" />
		</div>
	{:else if $formData}
		<div class="flex flex-row space-x-2 py-5">
			{#each $formData.images || [] as image}
				<!-- svelte-ignore missing-declaration -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="min-w-10 cursor-pointer" on:click={() => openModal(image)}>
					{#if image.type === 'pdf'}
						<img src="{assets}/images/pdf.png" alt={image.name} class="h-10 w-auto" />
					{:else}
						<img src={image.url} alt={image.name} class="h-10 w-auto" />
					{/if}
				</div>
			{/each}
		</div>
		<div class="mb-6 gap-1 lg:max-w-sm">
			<div>
				<Form.Field {form} name="documentFile">
					<Form.Control let:attrs>
						{#if $formData.images && $formData.images.length > 0}
							<Form.Label>Click button below to Upload More Files</Form.Label>
						{:else}
							<Form.Label>Click button below to Upload a File</Form.Label>
						{/if}

						{#if isImgLoading}
							<Icons.loaderPinwheel class="ml-2 animate-spin" />
						{:else}
							<Input
								id="picture"
								type="file"
								on:change={handleFileChange}
								class="bg-secondary text-white"
							/>
						{/if}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
		</div>
	{/if}
</div>

{#if isModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="relative flex h-3/4 w-full max-w-3xl flex-col rounded-lg bg-white p-2 pt-14">
			<Button variant="ghost" class="absolute right-2 top-2" on:click={closeModal}>
				<Icons.close />
			</Button>

			<div class="flex-grow overflow-auto">
				{#if selectedFile.type === 'pdf'}
					<iframe
						src={selectedFile.url}
						class="h-full w-full"
						frameborder="0"
						title={selectedFile.name}
					></iframe>
				{:else}
					<img src={selectedFile.url} alt={selectedFile.name} class="h-auto w-full" />
				{/if}
			</div>

			<div class="mt-4 flex justify-end">
				<Button variant="destructive" on:click={deleteFile}>
					{#if isImgLoading}
						<Icons.loaderPinwheel class="ml-2 animate-spin" />
					{:else}
						Delete <Icons.trash class="ml-2" />
					{/if}
				</Button>
			</div>
		</div>
	</div>
{/if}
