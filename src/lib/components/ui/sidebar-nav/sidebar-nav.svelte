<script>
	import { cubicInOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { cn } from '$lib/utils.js';
	import { page } from '$app/stores';
	import Button from '../button/button.svelte';

	let className = undefined;

	/**
	 * @type {any[]}
	 */
	export let items = [];
	export { className as class };

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut
	});

</script>

<div class="nav-container w-full overflow-y-auto">
	<nav class={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)}>
		{#each items as item}
			{@const isActive = $page.url.pathname === item.href}
				<Button
					href={item.href}
					variant="ghost"
					class={cn(!isActive && 'hover:underline', 'relative justify-start hover:bg-transparent')}
					data-sveltekit-noscroll
				>
					{#if isActive}
						<div
							class="absolute inset-0 rounded-md bg-muted"
							in:send={{ key: 'active-sidebar-tab' }}
							out:receive={{ key: 'active-sidebar-tab' }}
						/>
					{/if}
					<div class="relative">
						{item.title}
					</div>
				</Button>
		{/each}
	</nav>
</div>

<style>
	.nav-container {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	@media (max-width: 1023px) {
		.nav-container {
			margin: 0 -1rem;
			padding: 0 1rem;
		}

		nav {
			padding-bottom: 0.5rem;
			display: flex;
			white-space: nowrap; /* Ensure items stay on a single line */
			overflow-x: auto;
			-webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
		}

		:global(nav > *) {
			flex: 0 0 auto; /* Prevent shrinking, ensure horizontal scrolling */
			margin-right: 0.5rem;
		}

		:global(nav > *:last-child) {
			margin-right: 0;
		}
	}

	@media (min-width: 1024px) {
		.nav-container {
			overflow: visible;
		}

		nav {
			flex-direction: column;
		}
	}
</style>
