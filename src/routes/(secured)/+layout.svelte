<script lang="ts">
	import Menu from 'lucide-svelte/icons/menu';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { assets } from '$app/paths';
	import KLogo from '$lib/components/ui/icons/k-logo.svelte';
	import Footer from '$lib/components/ui/layout/footer.svelte';
	import { page } from '$app/stores';
	import { getInitials } from '$lib/utils';
	import Divider from '$lib/components/ui/divider/divider.svelte';

	$: ({ supabase, profile } = $page.data);
	$: pathName = $page.url.pathname.trim();

	const signOut = async () => {
		await supabase.auth.signOut();
		window.location.replace('/');
	};

	const navigation = [
		{ href: '/dashboard', pathIndex: '/dashboard', label: 'Dashboard' },
		{ href: '/issuer/list', pathIndex: '/issuer', label: 'Issuers' },
		{ href: '/notes', pathIndex: '/notes', label: 'Notes' },
		{ href: '/admin/users/list', pathIndex: '/admin', label: 'Administration' }
	];

	let isSheetOpen = false;

	const closeSheet = () => {
		isSheetOpen = false;
	};
</script>

<div class="grid h-full min-h-screen w-full grid-rows-[auto,1fr,auto]">
	{#if profile}
		<header
			class="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6"
		>
			<nav
				class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
			>
				<a href="##" class="hidden items-center gap-2 md:flex">
					<KLogo />
				</a>

				{#each navigation as navItem}
					<a
						href={navItem.href}
						class="whitespace-nowrap transition-colors hover:text-foreground {pathName.indexOf(
							navItem.pathIndex
						) !== -1
							? 'font-bold text-foreground'
							: ''}"
					>
						{navItem.label}
					</a>
				{/each}
			</nav>
			<Sheet.Root bind:open={isSheetOpen}>
				<Sheet.Trigger asChild let:builder>
					<Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
						<Menu class="h-5 w-5" />
						<span class="sr-only">Toggle navigation menu</span>
					</Button>
					<div class="md:hidden">
						<KLogo />
					</div>
				</Sheet.Trigger>
				<Sheet.Content side="left">
					<nav class="grid gap-6 text-base font-medium">
						<a href="##" class="flex items-center gap-2 font-semibold">
							<img src="{assets}/images/koredor.png" alt="Koredor Logo" class="h-10 w-auto" />
						</a>
						<Divider />
						{#each navigation as navItem}
							<a href={navItem.href} class="hover:text-foreground" on:click={closeSheet}>
								{navItem.label}
							</a>
						{/each}
					</nav>
				</Sheet.Content>
			</Sheet.Root>
			<div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
				<div class="ml-auto flex-1 sm:flex-initial">
					<div class="relative"></div>
				</div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button builders={[builder]} variant="secondary" size="icon" class="rounded-full">
							<Avatar.Root class="flex h-9 w-9">
								<Avatar.Image src={profile.avatarUrl} alt="Avatar" />
								<Avatar.Fallback class="bg-primary">
									{getInitials(profile.firstName, profile.lastName)}
								</Avatar.Fallback>
							</Avatar.Root>
							<span class="sr-only">Toggle user menu</span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Label>Hi {profile.firstName}!</DropdownMenu.Label>
						<DropdownMenu.Separator />
						{#if !['PQL', 'FAIL'].includes(profile.status)}
							<DropdownMenu.Item class="cursor-pointer" href="/profile"
								>Profile</DropdownMenu.Item
							>
						{/if}
						<DropdownMenu.Item class="cursor-pointer">Support</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item class="cursor-pointer" on:click={signOut}>Sign Out</DropdownMenu.Item
						>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</header>
	{/if}
	<slot></slot>
	<Footer />
</div>
