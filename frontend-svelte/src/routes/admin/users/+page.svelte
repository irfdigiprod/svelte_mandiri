<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/state';
	import { untrack } from 'svelte';

	let { data } = $props();

	// View toggle state
	let viewMode = $state<'table' | 'card'>('table');

	// Local search state
	let searchQuery = $state('');

	// Gender filter state
	let genderFilter = $state<'All' | 'Laki-laki' | 'Perempuan'>('All');
	let filterDropdownOpen = $state(false);

	// Pagination state
	let pageSize = $state<'5' | '10' | '50' | 'All'>('10');
	let currentPage = $state(1);

	// Collective actions state
	let selectedIds = $state<number[]>([]);

	// Helper to determine gender deterministically based on user ID
	function getUserGender(user: any): 'Laki-laki' | 'Perempuan' {
		return user.id % 2 === 0 ? 'Laki-laki' : 'Perempuan';
	}

	// Filter users based on search and gender
	let filteredUsers = $derived(
		data.users?.filter((u: any) => {
			const nameMatch = (u.name || '').toLowerCase().includes(searchQuery.toLowerCase());
			const emailMatch = (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
			const usernameMatch = (u.username || '').toLowerCase().includes(searchQuery.toLowerCase());
			const matchesSearch = nameMatch || emailMatch || usernameMatch;

			const matchesGender = genderFilter === 'All' || getUserGender(u) === genderFilter;

			return matchesSearch && matchesGender;
		}) || []
	);

	// Pagination calculations
	let totalItems = $derived(filteredUsers.length);
	let totalPages = $derived(
		pageSize === 'All' ? 1 : Math.ceil(totalItems / parseInt(pageSize))
	);

	let paginatedUsers = $derived.by(() => {
		if (pageSize === 'All') {
			return filteredUsers;
		}
		const size = parseInt(pageSize);
		const start = (currentPage - 1) * size;
		return filteredUsers.slice(start, start + size);
	});

	// Reset to first page when search, filters, or page size changes
	$effect(() => {
		const _ = [searchQuery, genderFilter, pageSize];
		currentPage = 1;
	});

	// Sync selection: remove deleted IDs automatically
	$effect(() => {
		const allAvailableIds = data.users?.map((u: any) => u.id) || [];
		untrack(() => {
			selectedIds = selectedIds.filter((id: number) => allAvailableIds.includes(id));
		});
	});

	// Selection helpers
	let isAllSelected = $derived(
		paginatedUsers.length > 0 && paginatedUsers.every((u: any) => selectedIds.includes(u.id))
	);

	function toggleSelectAll() {
		if (isAllSelected) {
			// Unselect all on the current page
			const currentPageIds = paginatedUsers.map((u: any) => u.id);
			selectedIds = selectedIds.filter((id: number) => !currentPageIds.includes(id));
		} else {
			// Select all on the current page
			const newIds = paginatedUsers
				.map((u: any) => u.id)
				.filter((id: number) => !selectedIds.includes(id));
			selectedIds = [...selectedIds, ...newIds];
		}
	}

	function toggleSelect(id: number) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((x: number) => x !== id);
		} else {
			selectedIds = [...selectedIds, id];
		}
	}

	function clearSelection() {
		selectedIds = [];
	}
</script>

<svelte:window onclick={() => (filterDropdownOpen = false)} />

<svelte:head>
	<title>Manage Users - Svelte Mandiri</title>
</svelte:head>

<div class="w-full" in:fade={{ duration: 250 }}>
	<!-- Main Panel Card -->
	<div class="bg-white border border-[#eef1f6] rounded-[24px] p-6 sm:p-8 shadow-sm" in:fly={{ y: 15, duration: 350, delay: 50 }}>
		
		<!-- Card Header (Reference Image Style) -->
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
			<div class="flex items-center gap-4">
				<div class="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
					<!-- Icon matching reference image style -->
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
				</div>
				<div>
					<h2 class="text-xl font-bold text-slate-900">Data Users</h2>
					<p class="text-xs text-slate-400 mt-0.5">Kelola data user — terhubung ke API</p>
				</div>
			</div>

			<!-- Action Buttons (Reference style: Dark brown main button, bordered secondary) -->
			<div class="flex items-center gap-3">
				<a
					href="/admin/users/create"
					class="px-5 py-3 text-xs font-bold bg-[#3f231c] hover:bg-[#4a2e2b] text-white rounded-xl shadow-md shadow-[#3f231c]/10 flex items-center gap-2 transition-all duration-200"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
					Tambah User
				</a>
				<button
					class="px-5 py-3 text-xs font-bold bg-white hover:bg-slate-50 border border-[#eef1f6] text-slate-700 rounded-xl flex items-center gap-2 transition-all duration-200"
					disabled
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					Import Excel
				</button>
			</div>
		</div>

		<!-- Collective Action Header Bar (Shows when items are selected) -->
		{#if selectedIds.length > 0}
			<div class="flex items-center justify-between bg-red-50/70 border border-red-100/80 rounded-2xl p-4 mb-6" transition:fade={{ duration: 150 }}>
				<div class="flex items-center gap-3">
					<span class="text-xs font-extrabold text-red-700 uppercase tracking-wider">{selectedIds.length} User Terpilih</span>
					<button 
						onclick={clearSelection}
						class="text-xs font-bold text-slate-500 hover:text-slate-700 underline"
					>
						Batalkan Pilihan
					</button>
				</div>
				<form method="POST" action="?/deleteSelected" use:enhance class="inline">
					<input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />
					<button
						type="submit"
						class="px-4 py-2.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-sm"
					>
						Hapus Terpilih
					</button>
				</form>
			</div>
		{/if}

		<!-- Sub Controls (Reference: Lists/Grid toggles on left, Search/Filter on right) -->
		<div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
			<!-- Toggles -->
			<div class="flex items-center gap-1.5 p-1 bg-slate-50 border border-[#eef1f6] rounded-xl self-start">
				<button 
					onclick={() => viewMode = 'table'}
					aria-label="List View" 
					class="p-1.5 rounded-lg transition-all {viewMode === 'table' ? 'bg-white border border-[#eef1f6] text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
				<button 
					onclick={() => viewMode = 'card'}
					aria-label="Grid View" 
					class="p-1.5 rounded-lg transition-all {viewMode === 'card' ? 'bg-white border border-[#eef1f6] text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
					</svg>
				</button>
			</div>

			<!-- Search & Filter -->
			<div class="flex items-center gap-3 w-full sm:w-auto">
				<div class="relative flex-grow sm:flex-grow-0">
					<input
						type="text"
						placeholder="Cari..."
						bind:value={searchQuery}
						class="w-full sm:w-64 pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-[#eef1f6] rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
					/>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3 top-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
				<div class="relative">
					<button 
						onclick={(e) => { e.stopPropagation(); filterDropdownOpen = !filterDropdownOpen; }}
						class="px-4 py-2.5 bg-white border border-[#eef1f6] text-slate-600 hover:text-slate-900 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm transition-all duration-200"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
						</svg>
						Filter: {genderFilter === 'All' ? 'Semua Status' : genderFilter}
					</button>
					{#if filterDropdownOpen}
						<div class="absolute right-0 mt-2 w-48 bg-white border border-[#eef1f6] rounded-2xl shadow-xl py-2 z-30">
							<button 
								onclick={() => { genderFilter = 'All'; filterDropdownOpen = false; }}
								class="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-[#3f231c] hover:bg-slate-50 transition-colors {genderFilter === 'All' ? 'text-amber-500 font-bold bg-amber-50/10' : ''}"
							>
								Semua Status
							</button>
							<button 
								onclick={() => { genderFilter = 'Laki-laki'; filterDropdownOpen = false; }}
								class="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-[#3f231c] hover:bg-slate-50 transition-colors {genderFilter === 'Laki-laki' ? 'text-amber-500 font-bold bg-amber-50/10' : ''}"
							>
								Laki-laki
							</button>
							<button 
								onclick={() => { genderFilter = 'Perempuan'; filterDropdownOpen = false; }}
								class="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-[#3f231c] hover:bg-slate-50 transition-colors {genderFilter === 'Perempuan' ? 'text-amber-500 font-bold bg-amber-50/10' : ''}"
							>
								Perempuan
							</button>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Table View -->
		{#if viewMode === 'table'}
			<div class="overflow-x-auto border border-[#eef1f6] rounded-2xl" transition:fade={{ duration: 150 }}>
				<table class="w-full text-left text-xs sm:text-sm text-slate-700 border-collapse">
					<thead>
						<tr class="bg-slate-50/70 text-slate-500 border-b border-[#eef1f6] font-bold text-xs uppercase tracking-wider">
							<th class="px-6 py-4 w-12 text-center">
								<input 
									type="checkbox" 
									checked={isAllSelected}
									onchange={toggleSelectAll}
									class="rounded border-slate-300 text-amber-500 focus:ring-amber-400 h-4.5 w-4.5 cursor-pointer" 
								/>
							</th>
							<th class="px-6 py-4">Nama User</th>
							<th class="px-6 py-4">Username</th>
							<th class="px-6 py-4">Email</th>
							<th class="px-6 py-4">Status</th>
							<th class="px-6 py-4 text-center w-40">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-[#eef1f6]">
						{#if paginatedUsers.length > 0}
							{#each paginatedUsers as user}
								<tr class="hover:bg-slate-50/50 transition duration-150">
									<td class="px-6 py-4 text-center">
										<input 
											type="checkbox" 
											checked={selectedIds.includes(user.id)}
											onchange={() => toggleSelect(user.id)}
											class="rounded border-slate-300 text-amber-500 focus:ring-amber-400 h-4.5 w-4.5 cursor-pointer" 
										/>
									</td>
									<td class="px-6 py-4">
										<div>
											<div class="font-bold text-slate-900">{user.name}</div>
											<div class="text-[10px] text-sky-500 font-semibold mt-0.5">Active Account</div>
										</div>
									</td>
									<td class="px-6 py-4 text-slate-600">@{user.username || '-'}</td>
									<td class="px-6 py-4 text-slate-500">{user.email}</td>
									<td class="px-6 py-4">
										<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-200">
											<span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
											{getUserGender(user)}
										</span>
									</td>
									<td class="px-6 py-4">
										<div class="flex items-center justify-center gap-2">
											<a
												href="/admin/users/edit/{user.id}"
												class="px-3 py-1.5 text-xs font-bold bg-[#fcf8f2] border border-[#f5e2cc] hover:border-[#f9c74f] text-[#3f231c] rounded-lg transition-colors"
											>
												EDIT
											</a>
											<form method="POST" action="?/delete" use:enhance class="inline">
												<input type="hidden" name="id" value={user.id} />
												<button
													type="submit"
													class="px-3 py-1.5 text-xs font-bold bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg transition-colors"
												>
													DELETE
												</button>
											</form>
										</div>
									</td>
								</tr>
							{/each}
						{:else}
							<tr>
								<td colspan="6" class="px-6 py-12 text-center text-slate-400 italic">
									Tidak ada user ditemukan. Silakan tambahkan user baru.
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		{:else}
			<!-- Card View (Grid) -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" transition:fade={{ duration: 150 }}>
				{#if paginatedUsers.length > 0}
					{#each paginatedUsers as user}
						<div class="bg-white border border-[#eef1f6] rounded-[24px] p-6 shadow-sm flex flex-col justify-between relative hover:border-amber-300 transition-all duration-300">
							<!-- Checkbox & Status badge -->
							<div class="flex items-center justify-between mb-4">
								<label class="flex items-center gap-2 cursor-pointer">
									<input 
										type="checkbox" 
										checked={selectedIds.includes(user.id)}
										onchange={() => toggleSelect(user.id)}
										class="rounded border-slate-300 text-amber-500 focus:ring-amber-400 h-4.5 w-4.5 cursor-pointer" 
									/>
									<span class="text-[10px] font-bold text-slate-400 tracking-wider">PILIH</span>
								</label>
								<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-200">
									<span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
									{getUserGender(user)}
								</span>
							</div>

							<!-- User Profile details -->
							<div class="flex items-start gap-4 mb-5">
								<div class="h-12 w-12 rounded-full bg-gradient-to-tr from-amber-400 to-[#3f231c] flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
									{user.name ? user.name[0].toUpperCase() : 'U'}
								</div>
								<div class="overflow-hidden">
									<h3 class="font-bold text-slate-900 truncate">{user.name}</h3>
									<p class="text-[10px] text-sky-500 font-bold">Active Account</p>
								</div>
							</div>

							<!-- Details -->
							<div class="space-y-2 border-t border-slate-50 pt-4 mb-5 text-xs text-slate-500">
								<div class="flex justify-between items-center">
									<span>Username</span>
									<span class="font-semibold text-slate-700">@{user.username || '-'}</span>
								</div>
								<div class="flex justify-between items-center">
									<span>Email</span>
									<span class="font-semibold text-slate-700 truncate max-w-[170px]">{user.email}</span>
								</div>
							</div>

							<!-- Card actions -->
							<div class="flex items-center justify-between border-t border-slate-50 pt-4 gap-3">
								<a
									href="/admin/users/edit/{user.id}"
									class="flex-grow text-center py-2 text-xs font-bold bg-[#fcf8f2] border border-[#f5e2cc] hover:border-[#f9c74f] text-[#3f231c] rounded-xl transition-colors"
								>
									EDIT
								</a>
								<form method="POST" action="?/delete" use:enhance class="flex-grow">
									<input type="hidden" name="id" value={user.id} />
									<button
										type="submit"
										class="w-full py-2 text-xs font-bold bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl transition-colors"
									>
										DELETE
									</button>
								</form>
							</div>
						</div>
					{/each}
				{:else}
					<div class="col-span-full bg-slate-50 border border-[#eef1f6] rounded-[24px] p-12 text-center text-slate-400 italic">
						Tidak ada user ditemukan. Silakan tambahkan user baru.
					</div>
				{/if}
			</div>
		{/if}

		<!-- Pagination Footer (Tampilkan 5, 10, 50, All) -->
		<div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-100">
			<!-- Page Size Selector -->
			<div class="flex items-center gap-2 text-xs text-slate-500 font-semibold">
				<span>Tampilkan</span>
				<select 
					bind:value={pageSize}
					class="bg-white border border-[#eef1f6] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-700 font-bold"
				>
					<option value="5">5</option>
					<option value="10">10</option>
					<option value="50">50</option>
					<option value="All">All</option>
				</select>
				<span>entri</span>
			</div>

			<!-- Showing range info -->
			{#if totalItems > 0}
				<div class="text-xs text-slate-400 font-medium">
					Showing {pageSize === 'All' ? 1 : (currentPage - 1) * parseInt(pageSize) + 1} to {pageSize === 'All' ? totalItems : Math.min(currentPage * parseInt(pageSize), totalItems)} of {totalItems} entries
				</div>
			{/if}

			<!-- Navigation controls -->
			{#if pageSize !== 'All' && totalPages > 1}
				<div class="flex items-center gap-1.5">
					<button 
						onclick={() => (currentPage = Math.max(1, currentPage - 1))}
						disabled={currentPage === 1}
						class="px-3 py-2 text-xs font-bold bg-white border border-[#eef1f6] text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:hover:text-slate-600 rounded-xl transition-all shadow-xs"
					>
						Prev
					</button>
					{#each Array(totalPages) as _, i}
						<button 
							onclick={() => (currentPage = i + 1)}
							class="px-3 py-2 text-xs font-bold rounded-xl transition-all {currentPage === i + 1 ? 'bg-[#3f231c] text-white shadow-md shadow-[#3f231c]/10' : 'bg-white border border-[#eef1f6] text-slate-600 hover:bg-slate-50'}"
						>
							{i + 1}
						</button>
					{/each}
					<button 
						onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
						disabled={currentPage === totalPages}
						class="px-3 py-2 text-xs font-bold bg-white border border-[#eef1f6] text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:hover:text-slate-600 rounded-xl transition-all shadow-xs"
					>
						Next
					</button>
				</div>
			{/if}
		</div>

	</div>
</div>
