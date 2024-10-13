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

	$: ({ supabase, profile } = $page.data);
	$: pathName = $page.url.pathname.trim();

	const signOut = async () => {
		await supabase.auth.signOut();
		window.location.replace('/');
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
				<a
					href="/dashboard"
					class="whitespace-nowrap transition-colors hover:text-foreground {pathName ===
					'/dashboard'
						? 'font-bold text-foreground'
						: ''}"
				>
					Dashboard
				</a>
				<a
					href="/issuer/list"
					class="whitespace-nowrap transition-colors hover:text-foreground {pathName.indexOf(
						'/issuer'
					) !== -1
						? 'font-bold text-foreground'
						: ''}"
				>
					Issuers
				</a>
				<a
					href="/notes"
					class="whitespace-nowrap transition-colors hover:text-foreground {pathName.indexOf(
						'/notes'
					) !== -1
						? 'font-bold text-foreground'
						: ''}"
				>
					Notes
				</a>
				<a
					href="/admin/users/list"
					class="whitespace-nowrap transition-colors hover:text-foreground {pathName.indexOf(
						'/admin'
					) !== -1
						? 'font-bold text-foreground'
						: ''}">Administration</a
				>
			</nav>
			<Sheet.Root>
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
					<nav class="grid gap-6 text-lg font-medium">
						<a href="##" class="flex items-center gap-2 text-lg font-semibold">
							<img src="{assets}/images/koredor.png" alt="Koredor Logo" class="h-10 w-auto" />
						</a>
						{#if profile.status === 'ACTIVE'}
							<a href="##" class="hover:text-foreground"> Dashboard </a>
							<a href="##" class="text-muted-foreground hover:text-foreground"> Portfolio </a>
							<a href="##" class="text-muted-foreground hover:text-foreground"> Note Auction </a>
							<a href="##" class="text-muted-foreground hover:text-foreground"> Issuer Request </a>
						{/if}
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
							<DropdownMenu.Item class="cursor-pointer" href="/profile/personal"
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
