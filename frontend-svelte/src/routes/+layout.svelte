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

	// State dropdown profil
	let dropdownOpen = $state(false);

	function toggleDropdown(e: Event) {
		e.stopPropagation();
		dropdownOpen = !dropdownOpen;
	}

	function closeDropdown() {
		dropdownOpen = false;
	}
</script>

<svelte:window onclick={closeDropdown} />

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
			<!-- Left Navigation Panel (Double Sidebar) -->
			<aside class="w-full md:w-[312px] flex-shrink-0 bg-white border-b md:border-b-0 md:border-r border-[#eef1f6] flex flex-col md:flex-row md:sticky md:top-0 md:h-screen overflow-hidden">
				<!-- Column 1: Narrow Left Column (Induk Menu Icons) - Hidden on mobile, visible on desktop -->
				<div class="hidden md:flex w-[72px] bg-[#f8fafc] border-r border-[#eef1f6] flex-col justify-between py-6 items-center h-full flex-shrink-0">
					<div class="flex flex-col items-center gap-5 w-full">
						<!-- Apps Icon (Selected) -->
						<button aria-label="Apps Category" class="h-11 w-11 rounded-2xl bg-[#3f231c] text-white flex items-center justify-center shadow-lg shadow-[#3f231c]/10">
							<iconify-icon icon="solar:widget-3-outline" class="text-xl"></iconify-icon>
						</button>
						
						<!-- Chart Icon -->
						<button aria-label="Charts Category" class="h-11 w-11 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-all">
							<iconify-icon icon="solar:graph-up-outline" class="text-xl"></iconify-icon>
						</button>
						
						<!-- Settings Icon -->
						<button aria-label="Settings Category" class="h-11 w-11 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-all">
							<iconify-icon icon="solar:settings-outline" class="text-xl"></iconify-icon>
						</button>
						
						<!-- Shield Icon -->
						<button aria-label="Security Category" class="h-11 w-11 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-all">
							<iconify-icon icon="solar:shield-check-outline" class="text-xl"></iconify-icon>
						</button>
					</div>

					<div class="flex flex-col items-center gap-5">
						<!-- Info Icon -->
						<button aria-label="App Info" class="h-11 w-11 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-all">
							<iconify-icon icon="solar:info-circle-outline" class="text-xl"></iconify-icon>
						</button>
					</div>
				</div>

				<!-- Column 2: Wide Right Column (Sidebar Navigation and Search) -->
				<div class="flex-grow flex flex-col h-full bg-white overflow-hidden">
					<div class="h-16 px-6 border-b border-[#eef1f6] flex items-center flex-shrink-0">
						<span class="text-sm font-bold text-slate-800 uppercase tracking-wider">Apps</span>
					</div>

					<!-- Scrollable Menu -->
					<div class="flex-grow overflow-hidden flex flex-col w-full">
						<SidebarMenu />
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
						<div class="relative">
							<button 
								onclick={toggleDropdown}
								class="flex items-center gap-2.5 pl-2 border-l border-slate-100 focus:outline-none hover:opacity-85 transition-opacity"
							>
								<div class="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-400 to-[#3f231c] flex items-center justify-center text-white font-bold text-sm shadow-sm">
									{user?.name ? user.name[0].toUpperCase() : 'A'}
								</div>
								<span class="text-xs font-semibold text-slate-700 hidden sm:inline-block">{user?.name || 'Irfan Alkhotiri'}</span>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400 hidden sm:inline-block transform transition-transform duration-200 {dropdownOpen ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</button>

							<!-- Dropdown Menu -->
							{#if dropdownOpen}
								<div class="absolute right-0 mt-2 w-48 bg-white border border-[#eef1f6] rounded-2xl shadow-xl py-2 z-50">
									<div class="px-4 py-2 border-b border-slate-50">
										<p class="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
										<p class="text-[10px] text-slate-400 truncate">{user?.email || ''}</p>
									</div>
									<a 
										href="/admin/profile" 
										class="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-[#3f231c] hover:bg-slate-50 transition-colors"
										onclick={closeDropdown}
									>
										<iconify-icon icon="solar:user-outline" class="text-sm"></iconify-icon>
										Profile
									</a>
									<a 
										href="/admin/change-password" 
										class="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-[#3f231c] hover:bg-slate-50 transition-colors"
										onclick={closeDropdown}
									>
										<iconify-icon icon="solar:key-outline" class="text-sm"></iconify-icon>
										Ganti Password
									</a>
									<div class="border-t border-slate-50 my-1"></div>
									<a 
										href="/logout" 
										data-sveltekit-reload
										class="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
										onclick={closeDropdown}
									>
										<iconify-icon icon="solar:logout-outline" class="text-sm"></iconify-icon>
										Logout
									</a>
								</div>
							{/if}
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
