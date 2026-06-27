<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/state';
	import { untrack } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import Modal from '../../../components/Modal.svelte';
	import ImportExcelModal from '../../../components/ImportExcelModal.svelte';
	import DataTable from '../../../components/DataTable.svelte';

	let { data, form } = $props();

	// View toggle state
	let viewMode = $state<'table' | 'card'>('table');

	// Success message visibility
	let showSuccess = $state(false);

	$effect(() => {
		if (form?.success) {
			showSuccess = true;
			const timer = setTimeout(() => {
				showSuccess = false;
			}, 3000);
			return () => clearTimeout(timer);
		}
	});

	// Delete confirmation modal state
	let showDeleteModal = $state(false);
	let showBulkDeleteModal = $state(false);
	let userToDelete = $state<any>(null);

	function confirmDelete(user: any) {
		userToDelete = user;
		showDeleteModal = true;
	}

	// Excel Import State
	let showImportModal = $state(false);

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

	// Reset to first page when search, filters, or page size changes
	$effect(() => {
		const _ = [searchQuery, genderFilter, pageSize];
		currentPage = 1;
	});</script>

<svelte:window onclick={() => (filterDropdownOpen = false)} />

<svelte:head>
	<title>Manage Users - Svelte Mandiri</title>
</svelte:head>

<div class="w-full max-w-6xl mx-auto" in:fade={{ duration: 250 }}>
	<!-- Main Panel Card -->
	<div
		class="bg-white border border-[#eef1f6] rounded-[24px] p-6 sm:p-8 shadow-sm"
		in:fly={{ y: 15, duration: 350, delay: 50 }}
	>
		<!-- Card Header (Reference Image Style) -->
		<div
			class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6"
		>
			<div class="flex items-center gap-4">
				<div
					class="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600"
				>
					<!-- Icon matching reference image style -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
						/>
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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3.5 w-3.5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Tambah User
				</a>
				<button
					onclick={() => (showImportModal = true)}
					class="px-5 py-3 text-xs font-bold bg-white hover:bg-slate-50 border border-[#eef1f6] text-slate-700 rounded-xl flex items-center gap-2 transition-all duration-200"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3.5 w-3.5 text-slate-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					Import Excel
				</button>
			</div>
		</div>

		<!-- Success Alert Banner -->
		{#if showSuccess}
			<div class="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-sm text-green-600 flex items-center gap-2" transition:fade>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				User berhasil dihapus!
			</div>
		{/if}

		{#snippet filterOptions()}
			<button
				onclick={() => {
					genderFilter = 'All';
					filterDropdownOpen = false;
				}}
				class="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-[#3f231c] hover:bg-slate-50 transition-colors {genderFilter === 'All' ? 'text-amber-500 font-bold bg-amber-50/10' : ''}"
			>
				Semua Status
			</button>
			<button
				onclick={() => {
					genderFilter = 'Laki-laki';
					filterDropdownOpen = false;
				}}
				class="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-[#3f231c] hover:bg-slate-50 transition-colors {genderFilter === 'Laki-laki' ? 'text-amber-500 font-bold bg-amber-50/10' : ''}"
			>
				Laki-laki
			</button>
			<button
				onclick={() => {
					genderFilter = 'Perempuan';
					filterDropdownOpen = false;
				}}
				class="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-[#3f231c] hover:bg-slate-50 transition-colors {genderFilter === 'Perempuan' ? 'text-amber-500 font-bold bg-amber-50/10' : ''}"
			>
				Perempuan
			</button>
		{/snippet}

		{#snippet row(user: any, isSelected: boolean, toggleSelect: () => void)}
			<tr class="hover:bg-slate-50/50 transition duration-150 {isSelected ? 'bg-slate-50/70' : ''}">
				<td class="px-6 py-4 text-center">
					<input
						type="checkbox"
						checked={isSelected}
						onchange={toggleSelect}
						class="rounded border-slate-300 text-amber-500 focus:ring-amber-400 h-4.5 w-4.5 cursor-pointer"
					/>
				</td>
				<td class="px-6 py-4">
					<div>
						<div class="font-bold text-slate-900">{user.name}</div>
						<div class="text-[10px] text-sky-500 font-semibold mt-0.5">
							Active Account
						</div>
					</div>
				</td>
				<td class="px-6 py-4 text-slate-600">@{user.username || '-'}</td>
				<td class="px-6 py-4 text-slate-500">{user.email}</td>
				<td class="px-6 py-4">
					<span
						class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-200"
					>
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
						<button
							type="button"
							onclick={() => confirmDelete(user)}
							class="px-3 py-1.5 text-xs font-bold bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg transition-colors"
						>
							DELETE
						</button>
					</div>
				</td>
			</tr>
		{/snippet}

		{#snippet card(user: any, isSelected: boolean, toggleSelect: () => void)}
			<div
				class="bg-white border border-[#eef1f6] rounded-[24px] p-6 shadow-sm flex flex-col justify-between relative hover:border-amber-300 transition-all duration-300 {isSelected ? 'border-amber-400 bg-amber-50/5' : ''}"
			>
				<!-- Checkbox & Status badge -->
				<div class="flex items-center justify-between mb-4">
					<label class="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={isSelected}
							onchange={toggleSelect}
							class="rounded border-slate-300 text-amber-500 focus:ring-amber-400 h-4.5 w-4.5 cursor-pointer"
						/>
						<span class="text-[10px] font-bold text-slate-400 tracking-wider">PILIH</span>
					</label>
					<span
						class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-200"
					>
						<span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
						{getUserGender(user)}
					</span>
				</div>

				<!-- User Profile details -->
				<div class="flex items-start gap-4 mb-5">
					<div
						class="h-12 w-12 rounded-full bg-gradient-to-tr from-amber-400 to-[#3f231c] flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0"
					>
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
						<span class="font-semibold text-slate-700 truncate max-w-[170px]"
							>{user.email}</span
						>
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
					<button
						type="button"
						onclick={() => confirmDelete(user)}
						class="w-full py-2 text-xs font-bold bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl transition-colors flex-grow"
					>
						DELETE
					</button>
				</div>
			</div>
		{/snippet}

		{#snippet batchActions(selectedCount: number, clearSelection: () => void)}
			<button
				type="button"
				onclick={() => (showBulkDeleteModal = true)}
				class="px-4 py-2.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-sm"
			>
				Hapus Terpilih
			</button>
		{/snippet}

		<DataTable
			items={filteredUsers}
			totalItemsCount={data.users?.length || 0}
			columns={[
				{ key: 'name', label: 'Nama User' },
				{ key: 'username', label: 'Username' },
				{ key: 'email', label: 'Email' },
				{ key: 'status', label: 'Status' },
				{ key: 'actions', label: 'Actions', class: 'text-center w-40' }
			]}
			bind:selectedIds={selectedIds}
			bind:searchQuery={searchQuery}
			bind:pageSize={pageSize}
			bind:currentPage={currentPage}
			bind:viewMode={viewMode}
			bind:filterDropdownOpen={filterDropdownOpen}
			filterLabel="Filter: {genderFilter === 'All' ? 'Semua Status' : genderFilter}"
			{filterOptions}
			{row}
			{card}
			{batchActions}
		/>
	</div>
</div>

<Modal
	bind:show={showDeleteModal}
	title="Konfirmasi Hapus User"
	size="sm"
	onclose={() => {
		userToDelete = null;
	}}
>
	<div class="space-y-4">
		<p class="text-slate-600">
			Apakah Anda yakin ingin menghapus user <strong class="text-slate-900">{userToDelete?.name}</strong> (username: @{userToDelete?.username})?
		</p>
		<p class="text-xs text-red-500 font-medium">
			Tindakan ini tidak dapat dibatalkan. Semua data terkait user ini akan dihapus secara permanen.
		</p>
	</div>

	{#snippet footer()}
		<button
			type="button"
			onclick={() => {
				showDeleteModal = false;
				userToDelete = null;
			}}
			class="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
		>
			Batal
		</button>
		<form
			method="POST"
			action="?/delete"
			use:enhance={() => {
				return async ({ update }) => {
					showDeleteModal = false;
					userToDelete = null;
					await update();
				};
			}}
		>
			<input type="hidden" name="id" value={userToDelete?.id} />
			<button
				type="submit"
				class="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-sm"
			>
				Ya, Hapus
			</button>
		</form>
	{/snippet}
</Modal>

<Modal
	bind:show={showBulkDeleteModal}
	title="Konfirmasi Hapus Beberapa User"
	size="sm"
	onclose={() => {}}
>
	<div class="space-y-4">
		<p class="text-slate-600">
			Apakah Anda yakin ingin menghapus <strong class="text-slate-900">{selectedIds.length}</strong> user yang terpilih?
		</p>
		<p class="text-xs text-red-500 font-medium">
			Tindakan ini tidak dapat dibatalkan. Semua data terkait user terpilih ini akan dihapus secara permanen.
		</p>
	</div>

	{#snippet footer()}
		<button
			type="button"
			onclick={() => {
				showBulkDeleteModal = false;
			}}
			class="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
		>
			Batal
		</button>
		<form
			method="POST"
			action="?/deleteSelected"
			use:enhance={() => {
				return async ({ update }) => {
					showBulkDeleteModal = false;
					selectedIds = [];
					await update();
				};
			}}
		>
			<input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />
			<button
				type="submit"
				class="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-sm"
			>
				Ya, Hapus Semua
			</button>
		</form>
	{/snippet}
</Modal>

<ImportExcelModal
	bind:show={showImportModal}
	existingUsers={data.users}
	onSuccess={async () => await invalidateAll()}
/>

