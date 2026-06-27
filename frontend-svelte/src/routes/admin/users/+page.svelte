<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/state';
	import { untrack } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import Modal from '../../../components/Modal.svelte';

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

	// Excel Import States
	let showImportModal = $state(false);
	let importStep = $state<'upload' | 'review' | 'processing' | 'done'>('upload');
	let parsedUsers = $state<any[]>([]);
	let importProgress = $state(0);
	let importResults = $state({ successCount: 0, failCount: 0 });
	let fileInput = $state<HTMLInputElement | null>(null);
	let importViewMode = $state<'table' | 'card'>('table');

	function openImportModal() {
		importStep = 'upload';
		parsedUsers = [];
		importProgress = 0;
		showImportModal = true;
	}

	function downloadTemplate() {
		const csvContent = "data:text/csv;charset=utf-8,Nama,Username (Email),Email,Password\nJohn Doe,johndoe@example.com,johndoe@example.com,password123\nJane Smith,janesmith@example.com,janesmith@example.com,secret123\n";
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "template_import_user.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function parseCSV(text: string): string[][] {
		const lines = [];
		let row = [""];
		let inQuotes = false;

		for (let i = 0; i < text.length; i++) {
			const c = text[i];
			const next = text[i+1];
			if (c === '"') {
				if (inQuotes && next === '"') {
					row[row.length - 1] += '"';
					i++;
				} else {
					inQuotes = !inQuotes;
				}
			} else if (c === ',' && !inQuotes) {
				row.push("");
			} else if ((c === '\r' || c === '\n') && !inQuotes) {
				if (c === '\r' && next === '\n') {
					i++;
				}
				lines.push(row);
				row = [""];
			} else {
				row[row.length - 1] += c;
			}
		}
		if (row.length > 1 || row[0] !== "") {
			lines.push(row);
		}
		return lines;
	}

	function processParsedLines(lines: string[][]) {
		if (lines.length === 0) return [];
		
		const headers = lines[0].map(h => h.trim().toLowerCase());
		
		const nameIndex = headers.findIndex(h => h.includes('nama') || h.includes('name'));
		const usernameIndex = headers.findIndex(h => h.includes('username'));
		const emailIndex = headers.findIndex(h => h.includes('email'));
		const passwordIndex = headers.findIndex(h => h.includes('password') || h.includes('sandi'));
		
		const parsedList = [];
		const seenUsernames = new Set<string>();
		const seenEmails = new Set<string>();

		const existingUsernames = new Set((data.users || []).map((u: any) => (u.username || '').toLowerCase().trim()));
		const existingEmails = new Set((data.users || []).map((u: any) => (u.email || '').toLowerCase().trim()));

		for (let i = 1; i < lines.length; i++) {
			const row = lines[i];
			if (row.length < 2) continue;
			
			const name = nameIndex !== -1 ? (row[nameIndex] || '').trim() : '';
			const username = usernameIndex !== -1 ? (row[usernameIndex] || '').trim() : '';
			const email = emailIndex !== -1 ? (row[emailIndex] || '').trim() : '';
			const password = passwordIndex !== -1 ? (row[passwordIndex] || '').trim() : '';
			
			const errors = [];
			if (!name) errors.push('Nama wajib diisi');
			
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			
			if (!username) {
				errors.push('Username wajib diisi');
			} else {
				const usernameLower = username.toLowerCase();
				if (!emailRegex.test(username)) {
					errors.push('Username harus berformat email valid');
				} else if (existingUsernames.has(usernameLower)) {
					errors.push('Username sudah terdaftar');
				} else if (seenUsernames.has(usernameLower)) {
					errors.push('Username kembar dalam file');
				} else {
					seenUsernames.add(usernameLower);
				}
			}
			
			if (!email) {
				errors.push('Email wajib diisi');
			} else {
				const emailLower = email.toLowerCase();
				if (!emailRegex.test(email)) {
					errors.push('Format email tidak valid');
				} else if (existingEmails.has(emailLower)) {
					errors.push('Email sudah terdaftar');
				} else if (seenEmails.has(emailLower)) {
					errors.push('Email kembar dalam file');
				} else {
					seenEmails.add(emailLower);
				}
			}
			
			if (!password) {
				errors.push('Password wajib diisi');
			} else if (password.length < 6) {
				errors.push('Password minimal 6 karakter');
			}
			
			parsedList.push({
				name,
				username,
				email,
				password,
				isValid: errors.length === 0,
				errors
			});
		}
		return parsedList;
	}

	function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;
		
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result as string;
			const lines = parseCSV(text);
			parsedUsers = processParsedLines(lines);
			importStep = 'review';
		};
		reader.readAsText(file);
	}

	async function startImport() {
		importStep = 'processing';
		importProgress = 0;
		
		const validUsers = parsedUsers.filter(u => u.isValid);
		const total = validUsers.length;
		if (total === 0) {
			importStep = 'done';
			importResults = { successCount: 0, failCount: parsedUsers.length };
			return;
		}
		
		let successCount = 0;
		let failCount = parsedUsers.filter(u => !u.isValid).length;
		
		for (let i = 0; i < total; i++) {
			const user = validUsers[i];
			const formData = new FormData();
			formData.append('name', user.name);
			formData.append('username', user.username);
			formData.append('email', user.email);
			formData.append('password', user.password);
			
			try {
				const response = await fetch('/admin/users/create?/create', {
					method: 'POST',
					body: formData
				});
				const resultText = await response.text();
				const parsed = JSON.parse(resultText);
				
				if (parsed.type === 'success' || (parsed.status && parsed.status < 400)) {
					successCount++;
				} else {
					failCount++;
				}
			} catch (e) {
				console.error(e);
				failCount++;
			}
			
			importProgress = Math.round(((i + 1) / total) * 150) / 1.5; // Smooth number
			importProgress = Math.min(100, Math.round(((i + 1) / total) * 100));
		}
		
		importResults = { successCount, failCount };
		importStep = 'done';
		
		await invalidateAll();
	}

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
	let totalPages = $derived(pageSize === 'All' ? 1 : Math.ceil(totalItems / parseInt(pageSize)));

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
		filteredUsers.length > 0 && filteredUsers.every((u: any) => selectedIds.includes(u.id))
	);

	function toggleSelectAll() {
		if (isAllSelected) {
			// Unselect all matching users
			const filteredUserIds = filteredUsers.map((u: any) => u.id);
			selectedIds = selectedIds.filter((id: number) => !filteredUserIds.includes(id));
		} else {
			// Select all matching users across all pages
			const newIds = filteredUsers
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
					onclick={() => openImportModal()}
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

		<!-- Collective Action Header Bar (Shows when items are selected) -->
		{#if selectedIds.length > 0}
			<div
				class="flex items-center justify-between bg-red-50/70 border border-red-100/80 rounded-2xl p-4 mb-6"
				transition:fade={{ duration: 150 }}
			>
				<div class="flex items-center gap-3">
					<span class="text-xs font-extrabold text-red-700 uppercase tracking-wider"
						>{selectedIds.length} User Terpilih</span
					>
					<button
						onclick={clearSelection}
						class="text-xs font-bold text-slate-500 hover:text-slate-700 underline"
					>
						Batalkan Pilihan
					</button>
				</div>
				<button
					type="button"
					onclick={() => (showBulkDeleteModal = true)}
					class="px-4 py-2.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-sm"
				>
					Hapus Terpilih
				</button>
			</div>
		{/if}

		<!-- Sub Controls (Reference: Lists/Grid toggles on left, Search/Filter on right) -->
		<div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
			<!-- Toggles -->
			<div
				class="flex items-center gap-1.5 p-1 bg-slate-50 border border-[#eef1f6] rounded-xl self-start"
			>
				<button
					onclick={() => (viewMode = 'table')}
					aria-label="List View"
					class="p-1.5 rounded-lg transition-all {viewMode === 'table'
						? 'bg-white border border-[#eef1f6] text-slate-800 shadow-sm'
						: 'text-slate-400 hover:text-slate-600'} flex items-center justify-center"
				>
					<iconify-icon icon="solar:hamburger-menu-outline" class="text-lg"></iconify-icon>
				</button>
				<button
					onclick={() => (viewMode = 'card')}
					aria-label="Grid View"
					class="p-1.5 rounded-lg transition-all {viewMode === 'card'
						? 'bg-white border border-[#eef1f6] text-slate-800 shadow-sm'
						: 'text-slate-400 hover:text-slate-600'} flex items-center justify-center"
				>
					<iconify-icon icon="solar:widget-outline" class="text-lg"></iconify-icon>
				</button>
				<!-- Page Size Selector -->
				<div class="flex items-center gap-2 text-xs text-slate-500 font-semibold">
					<select
						bind:value={pageSize}
						class="bg-white w-[80px] text-xs border border-[#eef1f6] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-700 font-bold"
					>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="50">50</option>
						<option value="All">All</option>
					</select>
				</div>
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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 absolute left-3 top-3 text-slate-400"
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
				<div class="relative">
					<button
						onclick={(e) => {
							e.stopPropagation();
							filterDropdownOpen = !filterDropdownOpen;
						}}
						class="px-4 py-2.5 bg-white border border-[#eef1f6] text-slate-600 hover:text-slate-900 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm transition-all duration-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-3.5 w-3.5 text-slate-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
							/>
						</svg>
						Filter: {genderFilter === 'All' ? 'Semua Status' : genderFilter}
					</button>
					{#if filterDropdownOpen}
						<div
							class="absolute right-0 mt-2 w-48 bg-white border border-[#eef1f6] rounded-2xl shadow-xl py-2 z-30"
						>
							<button
								onclick={() => {
									genderFilter = 'All';
									filterDropdownOpen = false;
								}}
								class="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-[#3f231c] hover:bg-slate-50 transition-colors {genderFilter ===
								'All'
									? 'text-amber-500 font-bold bg-amber-50/10'
									: ''}"
							>
								Semua Status
							</button>
							<button
								onclick={() => {
									genderFilter = 'Laki-laki';
									filterDropdownOpen = false;
								}}
								class="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-[#3f231c] hover:bg-slate-50 transition-colors {genderFilter ===
								'Laki-laki'
									? 'text-amber-500 font-bold bg-amber-50/10'
									: ''}"
							>
								Laki-laki
							</button>
							<button
								onclick={() => {
									genderFilter = 'Perempuan';
									filterDropdownOpen = false;
								}}
								class="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-[#3f231c] hover:bg-slate-50 transition-colors {genderFilter ===
								'Perempuan'
									? 'text-amber-500 font-bold bg-amber-50/10'
									: ''}"
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
			<div
				class="overflow-x-auto border border-[#eef1f6] rounded-2xl"
				transition:fade={{ duration: 150 }}
			>
				<table class="w-full text-left text-xs sm:text-sm text-slate-700 border-collapse">
					<thead>
						<tr
							class="bg-slate-50/70 text-slate-500 border-b border-[#eef1f6] font-bold text-xs uppercase tracking-wider"
						>
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
			<div
				class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
				in:fly={{ y: 15, duration: 500, delay: 50 }}
			>
				{#if paginatedUsers.length > 0}
					{#each paginatedUsers as user}
						<div
							class="bg-white border border-[#eef1f6] rounded-[24px] p-6 shadow-sm flex flex-col justify-between relative hover:border-amber-300 transition-all duration-300"
						>
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
					{/each}
				{:else}
					<div
						class="col-span-full bg-slate-50 border border-[#eef1f6] rounded-[24px] p-12 text-center text-slate-400 italic"
					>
						Tidak ada user ditemukan. Silakan tambahkan user baru.
					</div>
				{/if}
			</div>
		{/if}

		<!-- Pagination Footer (Tampilkan 5, 10, 50, All) -->
		<div
			class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-100"
		>
			<!-- Showing range info -->
			{#if totalItems > 0}
				<div class="text-xs text-slate-400 font-medium">
					Showing {pageSize === 'All' ? 1 : (currentPage - 1) * parseInt(pageSize) + 1} to {pageSize ===
					'All'
						? totalItems
						: Math.min(currentPage * parseInt(pageSize), totalItems)} of {totalItems} entries
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
							class="px-3 py-2 text-xs font-bold rounded-xl transition-all {currentPage === i + 1
								? 'bg-[#3f231c] text-white shadow-md shadow-[#3f231c]/10'
								: 'bg-white border border-[#eef1f6] text-slate-600 hover:bg-slate-50'}"
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

<Modal
	bind:show={showImportModal}
	title="Import Users via Excel/CSV"
	size={importStep === 'review' ? 'lg' : 'md'}
	onclose={() => {}}
>
	{#snippet footer()}
		{#if importStep === 'review'}
			<button
				type="button"
				onclick={() => {
					importStep = 'upload';
					parsedUsers = [];
				}}
				class="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
			>
				Kembali
			</button>
			<button
				type="button"
				onclick={startImport}
				disabled={parsedUsers.filter(u => u.isValid).length === 0}
				class="px-4 py-2 text-xs font-bold bg-[#3f231c] hover:bg-[#4a2e2b] text-white disabled:opacity-50 disabled:hover:bg-[#3f231c] rounded-xl transition-colors shadow-sm"
			>
				Proses Import ({parsedUsers.filter(u => u.isValid).length} User)
			</button>
		{/if}
	{/snippet}

	<!-- 3-Step Visual Stepper -->
	<div class="flex items-center justify-between max-w-md mx-auto mb-8 border-b border-slate-100 pb-5">
		<!-- Step 1: Unggah -->
		<div class="flex items-center gap-2">
			<div class="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200 {importStep === 'upload' ? 'bg-[#3f231c] text-white shadow-sm' : 'bg-green-100 text-green-700'}">
				{#if importStep !== 'upload'}
					<iconify-icon icon="solar:check-circle-bold" class="text-base"></iconify-icon>
				{:else}
					1
				{/if}
			</div>
			<span class="text-xs font-bold transition-all duration-200 {importStep === 'upload' ? 'text-slate-800' : 'text-slate-400'}">Unggah</span>
		</div>
		
		<!-- Line 1 -->
		<div class="flex-grow h-[2px] mx-3 bg-slate-100">
			<div class="h-full bg-[#3f231c] transition-all duration-300" style="width: {importStep !== 'upload' ? '100%' : '0%'}"></div>
		</div>
		
		<!-- Step 2: Review -->
		<div class="flex items-center gap-2">
			<div class="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200 {importStep === 'review' ? 'bg-[#3f231c] text-white shadow-sm' : importStep === 'processing' || importStep === 'done' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}">
				{#if importStep === 'processing' || importStep === 'done'}
					<iconify-icon icon="solar:check-circle-bold" class="text-base"></iconify-icon>
				{:else}
					2
				{/if}
			</div>
			<span class="text-xs font-bold transition-all duration-200 {importStep === 'review' ? 'text-slate-800' : 'text-slate-400'}">Review</span>
		</div>
		
		<!-- Line 2 -->
		<div class="flex-grow h-[2px] mx-3 bg-slate-100">
			<div class="h-full bg-[#3f231c] transition-all duration-300" style="width: {importStep === 'processing' || importStep === 'done' ? '100%' : '0%'}"></div>
		</div>
		
		<!-- Step 3: Proses -->
		<div class="flex items-center gap-2">
			<div class="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200 {importStep === 'processing' || importStep === 'done' ? 'bg-[#3f231c] text-white shadow-sm' : 'bg-slate-100 text-slate-500'}">
				3
			</div>
			<span class="text-xs font-bold transition-all duration-200 {importStep === 'processing' || importStep === 'done' ? 'text-slate-800' : 'text-slate-400'}">Proses</span>
		</div>
	</div>

	{#if importStep === 'upload'}
		<div class="space-y-6">
			<div class="flex items-center justify-between p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
				<div class="flex items-center gap-3">
					<span class="text-2xl">📥</span>
					<div>
						<h4 class="text-xs font-bold text-slate-800">Template Impor Data</h4>
						<p class="text-[10px] text-slate-400 mt-0.5">Gunakan template resmi agar format kolom sesuai.</p>
					</div>
				</div>
				<button
					type="button"
					onclick={downloadTemplate}
					class="px-4 py-2 bg-white hover:bg-slate-50 border border-amber-200 hover:border-amber-300 text-amber-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-xs"
				>
					<iconify-icon icon="solar:download-minimalistic-outline" class="text-sm"></iconify-icon>
					Unduh Template
				</button>
			</div>

			<!-- Drag & Drop Zone -->
			<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
			<div
				role="button"
				tabindex="0"
				onclick={() => fileInput?.click()}
				onkeydown={(e) => e.key === 'Enter' && fileInput?.click()}
				class="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-[20px] p-10 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-amber-50/10 flex flex-col items-center justify-center group"
			>
				<input
					type="file"
					accept=".csv"
					bind:this={fileInput}
					onchange={handleFileUpload}
					class="hidden"
				/>
				<div class="h-16 w-16 rounded-full bg-slate-100 group-hover:bg-amber-100 text-slate-400 group-hover:text-amber-600 flex items-center justify-center transition-colors mb-4 shadow-inner">
					<iconify-icon icon="solar:document-text-outline" class="text-3xl"></iconify-icon>
				</div>
				<p class="text-sm font-bold text-slate-700">Pilih file CSV template</p>
				<p class="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
					Seret & taruh file CSV Anda di sini, atau klik untuk menelusuri file dari perangkat Anda.
				</p>
			</div>
		</div>
	{:else if importStep === 'review'}
		<div class="space-y-6">
			<!-- Statistics Bar -->
			<div class="grid grid-cols-3 gap-4">
				<div class="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
					<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Baris</span>
					<span class="text-xl font-black text-slate-800 mt-0.5 block">{parsedUsers.length}</span>
				</div>
				<div class="p-3 bg-green-50/50 border border-green-100 rounded-xl text-center">
					<span class="text-[10px] font-bold text-green-600 uppercase tracking-wider block">Data Valid</span>
					<span class="text-xl font-black text-green-700 mt-0.5 block">{parsedUsers.filter(u => u.isValid).length}</span>
				</div>
				<div class="p-3 bg-red-50/50 border border-red-100 rounded-xl text-center">
					<span class="text-[10px] font-bold text-red-600 uppercase tracking-wider block">Tidak Valid</span>
					<span class="text-xl font-black text-red-700 mt-0.5 block">{parsedUsers.filter(u => !u.isValid).length}</span>
				</div>
			</div>

			<!-- Review Data Table / Card View Mode Toggle -->
			<div class="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
				<span class="text-xs font-bold text-slate-500 pl-2">Tampilan Preview:</span>
				<div class="flex items-center gap-1.5 p-0.5 bg-white border border-slate-200 rounded-lg">
					<button
						type="button"
						onclick={() => (importViewMode = 'table')}
						class="p-1 rounded-md transition-all flex items-center justify-center {importViewMode === 'table' ? 'bg-[#3f231c] text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'}"
						title="Tabel"
					>
						<iconify-icon icon="solar:hamburger-menu-outline" class="text-base"></iconify-icon>
					</button>
					<button
						type="button"
						onclick={() => (importViewMode = 'card')}
						class="p-1 rounded-md transition-all flex items-center justify-center {importViewMode === 'card' ? 'bg-[#3f231c] text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'}"
						title="Card"
					>
						<iconify-icon icon="solar:widget-outline" class="text-base"></iconify-icon>
					</button>
				</div>
			</div>

			{#if importViewMode === 'table'}
				<!-- Review Data Table (Horizontally scrollable) -->
				<div class="border border-slate-100 rounded-2xl overflow-y-auto overflow-x-auto max-h-[300px]">
					<table class="w-full text-left border-collapse text-xs min-w-[700px]">
						<thead>
							<tr class="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
								<th class="px-4 py-3">Status</th>
								<th class="px-4 py-3">Nama</th>
								<th class="px-4 py-3">Username (Email)</th>
								<th class="px-4 py-3">Email</th>
								<th class="px-4 py-3">Info / Error</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-50">
							{#each parsedUsers as user}
								<tr class={user.isValid ? 'hover:bg-slate-50/50' : 'bg-red-50/20 hover:bg-red-50/40'}>
									<td class="px-4 py-3 font-semibold">
										{#if user.isValid}
											<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-50 text-green-600 border border-green-200">
												VALID
											</span>
										{:else}
											<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-50 text-red-600 border border-red-200">
												ERROR
											</span>
										{/if}
									</td>
									<td class="px-4 py-3 font-medium text-slate-700">{user.name || '-'}</td>
									<td class="px-4 py-3 text-slate-500 font-mono">{user.username || '-'}</td>
									<td class="px-4 py-3 text-slate-500 font-mono">{user.email || '-'}</td>
									<td class="px-4 py-3">
										{#if user.isValid}
											<span class="text-slate-400 italic">Siap diimpor</span>
										{:else}
											<span class="text-red-500 font-medium block" title={user.errors.join(', ')}>
												{user.errors.join(', ')}
											</span>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<!-- Review Data Card Grid -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
					{#each parsedUsers as user}
						<div class="p-4 border rounded-2xl flex flex-col justify-between {user.isValid ? 'border-slate-200 bg-slate-50/10' : 'border-red-200 bg-red-50/10'}">
							<div class="flex items-center justify-between mb-3">
								<span class="font-bold text-slate-800 text-xs">{user.name || '-'}</span>
								{#if user.isValid}
									<span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-50 text-green-600 border border-green-200">VALID</span>
								{:else}
									<span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-50 text-red-600 border border-red-200">ERROR</span>
								{/if}
							</div>
							<div class="space-y-1.5 text-[11px] text-slate-500 mb-3">
								<div class="flex justify-between">
									<span class="text-slate-400">Username:</span>
									<span class="font-mono text-slate-700">@{user.username || '-'}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-slate-400">Email:</span>
									<span class="font-mono text-slate-700">{user.email || '-'}</span>
								</div>
							</div>
							{#if !user.isValid}
								<div class="p-2.5 bg-red-50 border border-red-100 text-red-600 text-[10px] rounded-xl font-semibold leading-relaxed">
									{user.errors.join(', ')}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{:else if importStep === 'processing'}
		<div class="py-8 flex flex-col items-center justify-center">
			<!-- Green Circular Progress Indicator -->
			<div class="relative flex items-center justify-center h-36 w-36 mx-auto mb-6">
				<svg class="w-full h-full transform -rotate-90">
					<!-- Background Track -->
					<circle
						cx="72"
						cy="72"
						r="60"
						stroke-width="6"
						stroke="#f1f5f9"
						fill="transparent"
					/>
					<!-- Green Active Segment -->
					<circle
						cx="72"
						cy="72"
						r="60"
						stroke-width="6"
						stroke="#10b981"
						fill="transparent"
						stroke-dasharray={2 * Math.PI * 60}
						stroke-dashoffset={2 * Math.PI * 60 * (1 - importProgress / 100)}
						stroke-linecap="round"
						class="transition-all duration-200 ease-out"
					/>
				</svg>
				<div class="absolute flex flex-col items-center justify-center">
					<span class="text-2xl font-black text-slate-800">{importProgress}%</span>
					<span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Proses</span>
				</div>
			</div>

			<h4 class="text-sm font-bold text-slate-800">Memasukkan Data Ke Database...</h4>
			<p class="text-xs text-slate-400 mt-1 text-center max-w-xs">
				Sedang mendaftarkan akun user valid secara bertahap. Harap tidak menutup jendela modal atau merefresh browser.
			</p>
		</div>
	{:else if importStep === 'done'}
		<div class="py-8 flex flex-col items-center justify-center text-center">
			<div class="h-16 w-16 rounded-full bg-green-50 border border-green-200 text-green-500 flex items-center justify-center mb-4 shadow-sm">
				<iconify-icon icon="solar:check-circle-bold" class="text-3xl"></iconify-icon>
			</div>

			<h4 class="text-sm font-bold text-slate-800">Proses Impor Selesai!</h4>
			
			<div class="my-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl inline-block text-left text-xs space-y-2">
				<p class="text-slate-600">Hasil ringkasan operasi impor data:</p>
				<div class="flex gap-6 pt-1 font-bold">
					<span class="text-green-600 flex items-center gap-1">
						<span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
						{importResults.successCount} Berhasil
					</span>
					<span class="text-slate-400 flex items-center gap-1">
						<span class="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
						{importResults.failCount} Gagal / Skip
					</span>
				</div>
			</div>

			<button
				type="button"
				onclick={() => {
					showImportModal = false;
				}}
				class="px-6 py-2.5 bg-[#3f231c] hover:bg-[#4a2e2b] text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
			>
				Selesai & Tutup
			</button>
		</div>
	{/if}
</Modal>

