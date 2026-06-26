<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';

	let { data } = $props();

	// State pencarian lokal
	let searchQuery = $state('');

	// Filter users berdasarkan input pencarian
	let filteredUsers = $derived(
		data.users?.filter((u: any) =>
			(u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
			(u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
			(u.username || '').toLowerCase().includes(searchQuery.toLowerCase())
		) || []
	);
</script>

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

		<!-- Sub Controls (Reference: Lists/Grid toggles on left, Search/Filter on right) -->
		<div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
			<!-- Toggles -->
			<div class="flex items-center gap-1.5 p-1 bg-slate-50 border border-[#eef1f6] rounded-xl self-start">
				<button aria-label="List View" class="p-1.5 bg-white border border-[#eef1f6] text-slate-800 rounded-lg shadow-sm">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
				<button aria-label="Grid View" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg" disabled>
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
				<button class="px-4 py-2.5 bg-white border border-[#eef1f6] text-slate-600 hover:text-slate-900 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm transition-all duration-200">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
					</svg>
					Filters
				</button>
			</div>
		</div>

		<!-- Users Table -->
		<div class="overflow-x-auto border border-[#eef1f6] rounded-2xl">
			<table class="w-full text-left text-xs sm:text-sm text-slate-700 border-collapse">
				<thead>
					<tr class="bg-slate-50/70 text-slate-500 border-b border-[#eef1f6] font-bold text-xs uppercase tracking-wider">
						<th class="px-6 py-4 w-12 text-center">
							<input type="checkbox" class="rounded border-slate-300 text-amber-500 focus:ring-amber-400" />
						</th>
						<th class="px-6 py-4">Nama User</th>
						<th class="px-6 py-4">Username</th>
						<th class="px-6 py-4">Email</th>
						<th class="px-6 py-4">Status</th>
						<th class="px-6 py-4 text-center w-40">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[#eef1f6]">
					{#if filteredUsers.length > 0}
						{#each filteredUsers as user}
							<tr class="hover:bg-slate-50/50 transition duration-150">
								<td class="px-6 py-4 text-center">
									<input type="checkbox" class="rounded border-slate-300 text-amber-500 focus:ring-amber-400" />
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
										Laki-laki
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

	</div>
</div>
