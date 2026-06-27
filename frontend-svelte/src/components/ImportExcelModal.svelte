<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { untrack } from 'svelte';
	import Modal from './Modal.svelte';

	// Props
	let {
		show = $bindable(false),
		existingUsers = [],
		onSuccess = () => {}
	} = $props<{
		show: boolean;
		existingUsers: any[];
		onSuccess?: () => void;
	}>();

	// Local Excel Import States
	let importStep = $state<'upload' | 'review' | 'processing' | 'done'>('upload');
	let parsedUsers = $state<any[]>([]);
	let importProgress = $state(0);
	let importResults = $state({ successCount: 0, failCount: 0 });
	let fileInput = $state<HTMLInputElement | null>(null);
	let importViewMode = $state<'table' | 'card'>('table');
	let importSearchQuery = $state('');
	let importPageSize = $state<'5' | '10' | '20' | '50' | 'All'>('5');
	let importCurrentPage = $state(1);

	let filteredImportUsers = $derived(
		parsedUsers.filter((u) => {
			if (!importSearchQuery) return true;
			const q = importSearchQuery.toLowerCase();
			return (
				(u.name || '').toLowerCase().includes(q) ||
				(u.username || '').toLowerCase().includes(q) ||
				(u.email || '').toLowerCase().includes(q) ||
				(u.errors || []).some((err: string) => err.toLowerCase().includes(q))
			);
		})
	);

	let paginatedImportUsers = $derived.by(() => {
		if (importPageSize === 'All') return filteredImportUsers;
		const size = parseInt(importPageSize);
		const start = (importCurrentPage - 1) * size;
		return filteredImportUsers.slice(start, start + size);
	});

	let totalImportPages = $derived.by(() => {
		if (importPageSize === 'All') return 1;
		const size = parseInt(importPageSize);
		return Math.ceil(filteredImportUsers.length / size) || 1;
	});

	$effect(() => {
		const q = importSearchQuery;
		const s = importPageSize;
		untrack(() => {
			importCurrentPage = 1;
		});
	});

	// Reset state when modal is opened
	$effect(() => {
		if (show) {
			importStep = 'upload';
			parsedUsers = [];
			importProgress = 0;
			importSearchQuery = '';
			importPageSize = '5';
			importCurrentPage = 1;
		}
	});

	function downloadTemplate() {
		const csvContent =
			'data:text/csv;charset=utf-8,Nama,Username (Email),Email,Password\nJohn Doe,johndoe@example.com,johndoe@example.com,password123\nJane Smith,janesmith@example.com,janesmith@example.com,secret123\n';
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', 'template_import_user.csv');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function parseCSV(text: string): string[][] {
		const lines = [];
		let row = [''];
		let inQuotes = false;

		for (let i = 0; i < text.length; i++) {
			const c = text[i];
			const next = text[i + 1];
			if (c === '"') {
				if (inQuotes && next === '"') {
					row[row.length - 1] += '"';
					i++;
				} else {
					inQuotes = !inQuotes;
				}
			} else if (c === ',' && !inQuotes) {
				row.push('');
			} else if ((c === '\r' || c === '\n') && !inQuotes) {
				if (c === '\r' && next === '\n') {
					i++;
				}
				lines.push(row);
				row = [''];
			} else {
				row[row.length - 1] += c;
			}
		}
		if (row.length > 1 || row[0] !== '') {
			lines.push(row);
		}
		return lines;
	}

	function processParsedLines(lines: string[][]) {
		if (lines.length === 0) return [];

		const headers = lines[0].map((h) => h.trim().toLowerCase());

		const nameIndex = headers.findIndex((h) => h.includes('nama') || h.includes('name'));
		const usernameIndex = headers.findIndex((h) => h.includes('username'));
		const emailIndex = headers.findIndex((h) => h.includes('email'));
		const passwordIndex = headers.findIndex((h) => h.includes('password') || h.includes('sandi'));

		const parsedList = [];
		const seenUsernames = new Set<string>();
		const seenEmails = new Set<string>();

		const existingUsernames = new Set(
			(existingUsers || []).map((u: any) => (u.username || '').toLowerCase().trim())
		);
		const existingEmails = new Set(
			(existingUsers || []).map((u: any) => (u.email || '').toLowerCase().trim())
		);

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

		const validUsers = parsedUsers.filter((u) => u.isValid);
		const total = validUsers.length;
		if (total === 0) {
			importStep = 'done';
			importResults = { successCount: 0, failCount: parsedUsers.length };
			return;
		}

		let successCount = 0;
		let failCount = parsedUsers.filter((u) => !u.isValid).length;

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

			importProgress = Math.min(100, Math.round(((i + 1) / total) * 100));
		}

		importResults = { successCount, failCount };
		importStep = 'done';

		onSuccess();
	}
</script>

<Modal
	bind:show
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
				disabled={parsedUsers.filter((u) => u.isValid).length === 0}
				class="px-4 py-2 text-xs font-bold bg-[#3f231c] hover:bg-[#4a2e2b] text-white disabled:opacity-50 disabled:hover:bg-[#3f231c] rounded-xl transition-colors shadow-sm"
			>
				Proses Import ({parsedUsers.filter((u) => u.isValid).length} User)
			</button>
		{/if}
	{/snippet}

	<!-- 3-Step Visual Stepper -->
	<div
		class="flex items-center justify-between max-w-md mx-auto mb-8 border-b border-slate-100 pb-5"
	>
		<!-- Step 1: Unggah -->
		<div class="flex items-center gap-2">
			<div
				class="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200 {importStep ===
				'upload'
					? 'bg-[#3f231c] text-white shadow-sm'
					: 'bg-green-100 text-green-700'}"
			>
				{#if importStep !== 'upload'}
					<iconify-icon icon="solar:check-circle-bold" class="text-base"></iconify-icon>
				{:else}
					1
				{/if}
			</div>
			<span
				class="text-xs font-bold transition-all duration-200 {importStep === 'upload'
					? 'text-slate-800'
					: 'text-slate-400'}">Unggah</span
			>
		</div>

		<!-- Line 1 -->
		<div class="flex-grow h-[2px] mx-3 bg-slate-100">
			<div
				class="h-full bg-[#3f231c] transition-all duration-300"
				style="width: {importStep !== 'upload' ? '100%' : '0%'}"
			></div>
		</div>

		<!-- Step 2: Review -->
		<div class="flex items-center gap-2">
			<div
				class="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200 {importStep ===
				'review'
					? 'bg-[#3f231c] text-white shadow-sm'
					: importStep === 'processing' || importStep === 'done'
						? 'bg-green-100 text-green-700'
						: 'bg-slate-100 text-slate-500'}"
			>
				{#if importStep === 'processing' || importStep === 'done'}
					<iconify-icon icon="solar:check-circle-bold" class="text-base"></iconify-icon>
				{:else}
					2
				{/if}
			</div>
			<span
				class="text-xs font-bold transition-all duration-200 {importStep === 'review'
					? 'text-slate-800'
					: 'text-slate-400'}">Review</span
			>
		</div>

		<!-- Line 2 -->
		<div class="flex-grow h-[2px] mx-3 bg-slate-100">
			<div
				class="h-full bg-[#3f231c] transition-all duration-300"
				style="width: {importStep === 'processing' || importStep === 'done' ? '100%' : '0%'}"
			></div>
		</div>

		<!-- Step 3: Proses -->
		<div class="flex items-center gap-2">
			<div
				class="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200 {importStep ===
					'processing' || importStep === 'done'
					? 'bg-[#3f231c] text-white shadow-sm'
					: 'bg-slate-100 text-slate-500'}"
			>
				3
			</div>
			<span
				class="text-xs font-bold transition-all duration-200 {importStep === 'processing' ||
				importStep === 'done'
					? 'text-slate-800'
					: 'text-slate-400'}">Proses</span
			>
		</div>
	</div>

	{#if importStep === 'upload'}
		<div class="space-y-6">
			<div
				class="flex items-center justify-between p-4 bg-amber-50/50 border border-amber-100 rounded-2xl"
			>
				<div class="flex items-center gap-3">
					<span class="text-2xl">📥</span>
					<div>
						<h4 class="text-xs font-bold text-slate-800">Template Impor Data</h4>
						<p class="text-[10px] text-slate-400 mt-0.5">
							Gunakan template resmi agar format kolom sesuai.
						</p>
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
				<div
					class="h-16 w-16 rounded-full bg-slate-100 group-hover:bg-amber-100 text-slate-400 group-hover:text-amber-600 flex items-center justify-center transition-colors mb-4 shadow-inner"
				>
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
					<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block"
						>Total Baris</span
					>
					<span class="text-xl font-black text-slate-800 mt-0.5 block">{parsedUsers.length}</span>
				</div>
				<div class="p-3 bg-green-50/50 border border-green-100 rounded-xl text-center">
					<span class="text-[10px] font-bold text-green-600 uppercase tracking-wider block"
						>Data Valid</span
					>
					<span class="text-xl font-black text-green-700 mt-0.5 block"
						>{parsedUsers.filter((u) => u.isValid).length}</span
					>
				</div>
				<div class="p-3 bg-red-50/50 border border-red-100 rounded-xl text-center">
					<span class="text-[10px] font-bold text-red-600 uppercase tracking-wider block"
						>Tidak Valid</span
					>
					<span class="text-xl font-black text-red-700 mt-0.5 block"
						>{parsedUsers.filter((u) => !u.isValid).length}</span
					>
				</div>
			</div>

			<!-- Controls Bar (Search, Page Size, View Toggle) -->
			<div
				class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100"
			>
				<!-- Left: Search and Page Size -->
				<div class="flex items-center gap-3 w-full sm:w-auto flex-grow">
					<!-- Search -->
					<div class="relative flex-grow sm:flex-grow-0 sm:w-64">
						<span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
							<iconify-icon icon="solar:magnifer-outline" class="text-sm"></iconify-icon>
						</span>
						<input
							type="text"
							bind:value={importSearchQuery}
							placeholder="Cari nama, username, email..."
							class="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 text-xs transition duration-200"
						/>
					</div>
					<!-- Page Size -->
					<div class="flex items-center gap-2 flex-shrink-0">
						<span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Baris:</span
						>
						<select
							bind:value={importPageSize}
							class="bg-white w-[60px] border border-slate-200 text-slate-700 text-xs rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
						>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="50">50</option>
							<option value="All">All</option>
						</select>
					</div>
				</div>

				<!-- Right: View Mode Toggle -->
				<div
					class="flex items-center gap-1.5 p-0.5 bg-white border border-slate-205 rounded-lg flex-shrink-0"
				>
					<button
						type="button"
						onclick={() => (importViewMode = 'table')}
						class="p-1 rounded-md transition-all flex items-center justify-center {importViewMode ===
						'table'
							? 'bg-[#3f231c] text-white shadow-xs'
							: 'text-slate-400 hover:text-slate-600'}"
						title="Tabel"
					>
						<iconify-icon icon="solar:hamburger-menu-outline" class="text-base"></iconify-icon>
					</button>
					<button
						type="button"
						onclick={() => (importViewMode = 'card')}
						class="p-1 rounded-md transition-all flex items-center justify-center {importViewMode ===
						'card'
							? 'bg-[#3f231c] text-white shadow-xs'
							: 'text-slate-400 hover:text-slate-600'}"
						title="Card"
					>
						<iconify-icon icon="solar:widget-outline" class="text-base"></iconify-icon>
					</button>
				</div>
			</div>

			{#if importViewMode === 'table'}
				<!-- Review Data Table (Horizontally scrollable) -->
				<div
					class="border border-slate-100 rounded-2xl overflow-y-auto overflow-x-auto max-h-[300px]"
				>
					<table class="w-full text-left border-collapse text-xs min-w-[700px]">
						<thead>
							<tr
								class="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider"
							>
								<th class="px-4 py-3">Status</th>
								<th class="px-4 py-3">Nama</th>
								<th class="px-4 py-3">Username (Email)</th>
								<th class="px-4 py-3">Email</th>
								<th class="px-4 py-3">Info / Error</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-50">
							{#each paginatedImportUsers as user}
								<tr
									class={user.isValid ? 'hover:bg-slate-50/50' : 'bg-red-50/20 hover:bg-red-50/40'}
								>
									<td class="px-4 py-3 font-semibold">
										{#if user.isValid}
											<span
												class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-50 text-green-600 border border-green-200"
											>
												VALID
											</span>
										{:else}
											<span
												class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-50 text-red-600 border border-red-200"
											>
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
					{#each paginatedImportUsers as user}
						<div
							class="p-4 border rounded-2xl flex flex-col justify-between {user.isValid
								? 'border-slate-200 bg-slate-50/10'
								: 'border-red-200 bg-red-50/10'}"
						>
							<div class="flex items-center justify-between mb-3">
								<span class="font-bold text-slate-800 text-xs">{user.name || '-'}</span>
								{#if user.isValid}
									<span
										class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-50 text-green-600 border border-green-200"
										>VALID</span
									>
								{:else}
									<span
										class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-50 text-red-600 border border-red-200"
										>ERROR</span
									>
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
								<div
									class="p-2.5 bg-red-50 border border-red-100 text-red-600 text-[10px] rounded-xl font-semibold leading-relaxed"
								>
									{user.errors.join(', ')}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}

			<!-- Pagination Controls for Importer -->
			{#if importPageSize !== 'All' && totalImportPages > 1}
				<div class="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
					<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
						Menampilkan {(importCurrentPage - 1) * parseInt(importPageSize) + 1} - {Math.min(
							importCurrentPage * parseInt(importPageSize),
							filteredImportUsers.length
						)} dari {filteredImportUsers.length} baris
					</span>
					<div class="flex items-center gap-1">
						<button
							type="button"
							onclick={() => (importCurrentPage = Math.max(1, importCurrentPage - 1))}
							disabled={importCurrentPage === 1}
							class="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 text-xs rounded-lg transition-colors font-semibold"
						>
							Prev
						</button>
						{#each Array(totalImportPages) as _, i}
							<button
								type="button"
								onclick={() => (importCurrentPage = i + 1)}
								class="h-7 w-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all {importCurrentPage ===
								i + 1
									? 'bg-[#3f231c] text-white shadow-sm'
									: 'text-slate-500 hover:bg-slate-50'}"
							>
								{i + 1}
							</button>
						{/each}
						<button
							type="button"
							onclick={() =>
								(importCurrentPage = Math.min(totalImportPages, importCurrentPage + 1))}
							disabled={importCurrentPage === totalImportPages}
							class="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 text-xs rounded-lg transition-colors font-semibold"
						>
							Next
						</button>
					</div>
				</div>
			{/if}
		</div>
	{:else if importStep === 'processing'}
		<div class="py-8 flex flex-col items-center justify-center">
			<!-- Green Circular Progress Indicator -->
			<div class="relative flex items-center justify-center h-36 w-36 mx-auto mb-6">
				<svg class="w-full h-full transform -rotate-90">
					<!-- Background Track -->
					<circle cx="72" cy="72" r="60" stroke-width="6" stroke="#f1f5f9" fill="transparent" />
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
					<span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5"
						>Proses</span
					>
				</div>
			</div>

			<h4 class="text-sm font-bold text-slate-800">Memasukkan Data Ke Database...</h4>
			<p class="text-xs text-slate-400 mt-1 text-center max-w-xs">
				Sedang mendaftarkan akun user valid secara bertahap. Harap tidak menutup jendela modal atau
				merefresh browser.
			</p>
		</div>
	{:else if importStep === 'done'}
		<div class="py-8 flex flex-col items-center justify-center text-center">
			<div
				class="h-16 w-16 rounded-full bg-green-50 border border-green-200 text-green-500 flex items-center justify-center mb-4 shadow-sm"
			>
				<iconify-icon icon="solar:check-circle-bold" class="text-3xl"></iconify-icon>
			</div>

			<h4 class="text-sm font-bold text-slate-800">Proses Impor Selesai!</h4>

			<div
				class="my-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl inline-block text-left text-xs space-y-2"
			>
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
					show = false;
				}}
				class="px-6 py-2.5 bg-[#3f231c] hover:bg-[#4a2e2b] text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
			>
				Selesai & Tutup
			</button>
		</div>
	{/if}
</Modal>
