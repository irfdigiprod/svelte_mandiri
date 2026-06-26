<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import SidebarMenu from '../components/SidebarMenu.svelte';

	let { children } = $props();

	// Cek apakah halaman saat ini merupakan bagian dari admin panel
	let isAdmin = $derived(page.url.pathname.startsWith('/admin'));

	// Dapatkan data user dari page store data
	let user = $derived(page.data.user);
</script>

<svelte:head>
	<title>Svelte Mandiri - Admin Panel</title>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<!-- Global Font and Light Background -->
<div class="min-h-screen bg-[#f4f6f8] font-['Outfit'] text-slate-800 flex flex-col selection:bg-amber-400 selection:text-slate-900 antialiased">
	{#if isAdmin}
		<!-- Layout untuk Halaman Admin -->
		<div class="flex flex-col md:flex-row min-h-screen">
			<!-- Left Navigation Panel (Sidebar) -->
			<aside class="w-full md:w-64 flex-shrink-0 bg-white border-b md:border-b-0 md:border-r border-[#eef1f6] flex flex-col md:sticky md:top-0 md:h-screen">
				<!-- Outer/Inner Sidebar Combined -->
				<div class="flex flex-col h-full">
					<!-- Top Branding -->
					<div class="h-16 px-6 border-b border-[#eef1f6] flex items-center gap-3">
						<div class="h-8 w-8 rounded-xl bg-gradient-to-tr from-amber-400 to-[#3f231c] flex items-center justify-center shadow-md shadow-amber-400/10">
							<span class="font-extrabold text-xs text-white">SM</span>
						</div>
						<span class="text-base font-extrabold tracking-tight text-slate-950">
							SVELTE<span class="text-amber-500">MANDIRI</span>
						</span>
					</div>

					<!-- Search input (Dummy matching the reference image) -->
					<div class="p-4 hidden md:block">
						<div class="relative">
							<input
								type="text"
								placeholder="Cari menu..."
								disabled
								class="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-[#eef1f6] rounded-xl text-slate-400 placeholder-slate-400 focus:outline-none cursor-not-allowed"
							/>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
					</div>

					<!-- Sidebar Navigation Links -->
					<div class="flex-grow p-4 md:pt-0 overflow-y-auto">
						<SidebarMenu />
					</div>

					<!-- Profile Card Widget (At the bottom, matching reference image) -->
					<div class="p-4 border-t border-[#eef1f6] mt-auto hidden md:block">
						<div class="flex items-center gap-3">
							<div class="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 to-[#3f231c] flex items-center justify-center text-white font-bold text-sm shadow-sm">
								{user?.name ? user.name[0].toUpperCase() : 'A'}
							</div>
							<div class="flex-grow overflow-hidden">
								<h4 class="text-xs font-bold text-slate-900 truncate">{user?.name || 'Irfan Alkhotiri'}</h4>
								<p class="text-[10px] text-slate-400 truncate">{user?.email || 'irf.digiprod@gmail.com'}</p>
							</div>
						</div>
					</div>
				</div>
			</aside>

			<!-- Main Content Wrapper (Right) -->
			<div class="flex-grow flex flex-col min-h-screen w-full overflow-hidden">
				<!-- Top Bar Header -->
				<header class="h-16 bg-white border-b border-[#eef1f6] flex items-center justify-between px-6 sm:px-8 sticky top-0 z-40">
					<div class="flex items-center gap-3">
						<h1 class="text-base font-bold tracking-tight text-slate-900">
							Pondok Pesantren Minhajul Haq
						</h1>
					</div>
					<div class="flex items-center gap-4">
						<!-- Notification Bell -->
						<button aria-label="Notifications" class="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all relative">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
							</svg>
							<span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
						</button>
						
						<!-- Profile Dropdown -->
						<div class="flex items-center gap-2.5 pl-2 border-l border-slate-100">
							<div class="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-400 to-[#3f231c] flex items-center justify-center text-white font-bold text-sm shadow-sm">
								{user?.name ? user.name[0].toUpperCase() : 'A'}
							</div>
							<span class="text-xs font-semibold text-slate-700 hidden sm:inline-block">{user?.name || 'Irfan Alkhotiri'}</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400 hidden sm:inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>
				</header>

				<!-- Main Page Content Grid -->
				<main class="flex-grow p-6 sm:p-8">
					{@render children()}
				</main>
			</div>
		</div>
	{:else}
		<!-- Layout untuk Halaman Non-Admin (Login, Register, Home) -->
		<!-- Simple Modern Navbar -->
		<nav class="bg-white border-b border-[#eef1f6] h-16 flex items-center justify-between px-6 sm:px-8">
			<div class="flex items-center gap-3">
				<div class="h-8 w-8 rounded-lg bg-gradient-to-tr from-amber-400 to-[#3f231c] flex items-center justify-center shadow-md shadow-amber-400/10">
					<span class="font-extrabold text-xs text-white">SM</span>
				</div>
				<a href="/" class="text-lg font-bold tracking-tight text-slate-800 hover:opacity-90">
					Svelte<span class="text-amber-500">Mandiri</span>
				</a>
			</div>
			<div class="flex items-center gap-4">
				<a href="/login" class="text-sm font-semibold text-slate-500 hover:text-[#3f231c] transition-colors">
					Login
				</a>
				<a href="/register" class="px-4 py-2 text-xs font-bold bg-[#3f231c] hover:bg-[#4a2e2b] text-white rounded-xl transition-all shadow-sm">
					Register
				</a>
			</div>
		</nav>
		
		<main class="flex-grow flex items-center justify-center p-6">
			{@render children()}
		</main>
	{/if}
</div>
