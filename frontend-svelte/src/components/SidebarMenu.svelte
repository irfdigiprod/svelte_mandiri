<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	// Dapatkan data user dari page store data
	let user = $derived(page.data.user);

	// State pencarian menu
	let searchQuery = $state('');

	// Definisikan struktur menu
	interface SubMenuItem {
		name: string;
		href: string;
	}

	interface MenuItem {
		name: string;
		icon: string;
		href?: string;
		children?: SubMenuItem[];
	}

	// Menu list matching the screenshot style (Chats, Tabungan, User Profile, Guru, Santri, Kedisiplinan, Akademik, Tahfidz, Klinik)
	const menuItems: MenuItem[] = [
		{ name: 'Chats', icon: 'solar:chat-round-line-outline', href: '#' },
		{ name: 'Dashboard', icon: 'solar:wallet-2-outline', href: '/admin/dashboard' },
		{ name: 'User Profile', icon: 'solar:user-circle-outline', href: '#' },
		{
			name: 'Guru',
			icon: 'solar:case-minimalistic-outline',
			children: [
				{ name: 'Data Guru', href: '#' },
				{ name: 'Absensi Guru', href: '#' }
			]
		},
		{
			name: 'Users',
			icon: 'solar:users-group-two-rounded-outline',
			children: [
				{ name: 'Data Users', href: '/admin/users' },
				{ name: 'Absensi Users', href: '#' },
				{ name: 'Izin Pulang', href: '#' },
				{ name: 'Kamar', href: '#' }
			]
		},
		{
			name: 'Kedisiplinan',
			icon: 'solar:shield-check-outline',
			children: [
				{ name: 'Pelanggaran', href: '#' },
				{ name: 'Penghargaan', href: '#' }
			]
		},
		{
			name: 'Akademik',
			icon: 'solar:notebook-outline',
			children: [
				{ name: 'Mata Pelajaran', href: '#' },
				{ name: 'Jadwal Kelas', href: '#' }
			]
		},
		{
			name: 'Tahfidz',
			icon: 'solar:book-open-outline',
			children: [
				{ name: 'Setoran Hafalan', href: '#' },
				{ name: 'Target Tahfidz', href: '#' }
			]
		},
		{
			name: 'Klinik',
			icon: 'solar:heart-pulse-outline',
			children: [
				{ name: 'Data Kesehatan', href: '#' },
				{ name: 'Rekam Medis', href: '#' }
			]
		}
	];

	// Track menu mana saja yang terbuka (state accordions)
	let openMenus = $state<Record<string, boolean>>({
		Santri: true // Default Santri terbuka seperti pada gambar
	});

	function toggleMenu(name: string) {
		openMenus[name] = !openMenus[name];
	}

	// Filter menu berdasarkan input pencarian
	let filteredMenuItems = $derived.by(() => {
		if (!searchQuery.trim()) {
			return menuItems;
		}

		const query = searchQuery.toLowerCase();
		const results: MenuItem[] = [];

		for (const item of menuItems) {
			// Cek apakah parent menu cocok
			const parentMatches = item.name.toLowerCase().includes(query);

			// Cek apakah ada children yang cocok
			const filteredChildren =
				item.children?.filter((child) => child.name.toLowerCase().includes(query)) || [];

			if (parentMatches || filteredChildren.length > 0) {
				// Jika pencarian cocok, otomatis buka accordion parent ini
				if (item.children) {
					openMenus[item.name] = true;
				}
				results.push({
					...item,
					children: item.children ? filteredChildren : undefined
				});
			}
		}
		return results;
	});

	// Helper untuk mengecek apakah path aktif
	function isPathActive(href: string) {
		return page.url.pathname === href;
	}

	// Cek apakah ada anak menu yang aktif
	function isParentActive(item: MenuItem) {
		if (item.children) {
			return item.children.some((child) => isPathActive(child.href));
		}
		return item.href ? isPathActive(item.href) : false;
	}
</script>

<div class="flex flex-col h-full w-full overflow-hidden">
	<!-- Search input (Cari menu...) -->
	<div class="px-4 py-3">
		<div class="relative">
			<input
				type="text"
				placeholder="Cari menu..."
				bind:value={searchQuery}
				class="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-[#eef1f6] rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:bg-white transition-all"
			/>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-3.5 w-3.5 absolute left-3 top-3 text-slate-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
		</div>
	</div>

	<!-- Scrollable Menu Items -->
	<div class="flex-grow overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin">
		{#each filteredMenuItems as item}
			<div>
				{#if item.children}
					<!-- Parent Menu Accordion -->
					<button
						onclick={() => toggleMenu(item.name)}
						class="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 {isParentActive(
							item
						)
							? 'bg-[#f9c74f] text-slate-900 shadow-sm'
							: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}"
					>
						<div class="flex items-center gap-3">
							<iconify-icon icon={item.icon} class="text-lg"></iconify-icon>
							<span>{item.name}</span>
						</div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-3.5 w-3.5 transform transition-transform duration-200 {openMenus[item.name]
								? 'rotate-180'
								: ''}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					<!-- Children Submenu Items -->
					{#if openMenus[item.name]}
						<div class="mt-1 ml-4 pl-3 border-l border-slate-100 space-y-1">
							{#each item.children as child}
								<a
									href={child.href}
									class="block px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 {isPathActive(
										child.href
									)
										? 'bg-[#f9c74f] border border-blue-600 text-slate-950 shadow-sm font-bold'
										: 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}"
								>
									{child.name}
								</a>
							{/each}
						</div>
					{/if}
				{:else}
					<!-- Single Link Item -->
					<a
						href={item.href}
						class="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 {isPathActive(
							item.href || ''
						)
							? 'bg-[#f9c74f] text-slate-900 shadow-sm'
							: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}"
					>
						<iconify-icon icon={item.icon} class="text-lg"></iconify-icon>
						<span>{item.name}</span>
					</a>
				{/if}
			</div>
		{/each}
	</div>

	<!-- User Profile Widget (At the bottom, matching reference image) -->
	<div
		class="p-4 border-t border-[#eef1f6] bg-slate-50/50 mt-auto flex items-center justify-between gap-2"
	>
		<div class="flex items-center gap-3 overflow-hidden">
			<div
				class="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 to-[#3f231c] flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0"
			>
				{user?.name ? user.name[0].toUpperCase() : 'I'}
			</div>
			<div class="overflow-hidden">
				<h4 class="text-xs font-bold text-slate-900 truncate">{user?.name || 'Irfan Alkhotiri'}</h4>
				<p class="text-[10px] text-slate-400 truncate">{user?.email || 'irf.digiprod@gmail.com'}</p>
			</div>
		</div>
	</div>
</div>
