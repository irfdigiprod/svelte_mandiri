<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { untrack } from 'svelte';

	interface Column {
		key: string;
		label: string;
		class?: string;
	}

	let {
		items = [], // Pre-filtered items
		totalItemsCount = 0, // Total items in DB (for "Showing X to Y of Z entries")
		columns = [],
		selectedIds = $bindable([]),
		searchQuery = $bindable(''),
		pageSize = $bindable('10'),
		currentPage = $bindable(1),
		viewMode = $bindable('table'),
		searchPlaceholder = "Cari...",
		
		// Filter Dropdown
		filterLabel = "Filter",
		filterDropdownOpen = $bindable(false),
		filterOptions, // snippet
		
		// Body snippets
		row, // snippet: row(item, isSelected, toggleSelect)
		card, // snippet: card(item, isSelected, toggleSelect)
		batchActions // snippet: batchActions(selectedCount, clearSelection)
	} = $props<{
		items: any[];
		totalItemsCount: number;
		columns: Column[];
		selectedIds: any[];
		searchQuery: string;
		pageSize: '5' | '10' | '50' | 'All';
		currentPage: number;
		viewMode: 'table' | 'card';
		searchPlaceholder?: string;
		filterLabel?: string;
		filterDropdownOpen?: boolean;
		
		filterOptions?: import('svelte').Snippet;
		row: import('svelte').Snippet<[any, boolean, () => void]>;
		card: import('svelte').Snippet<[any, boolean, () => void]>;
		batchActions?: import('svelte').Snippet<[number, () => void]>;
	}>();

	// Paginated Items
	let paginatedItems = $derived.by(() => {
		if (pageSize === 'All') return items;
		const size = parseInt(pageSize);
		const start = (currentPage - 1) * size;
		return items.slice(start, start + size);
	});

	let totalPages = $derived.by(() => {
		if (pageSize === 'All') return 1;
		const size = parseInt(pageSize);
		return Math.ceil(items.length / size) || 1;
	});

	// Select All logic
	let isAllSelected = $derived(
		items.length > 0 && items.every((u: any) => selectedIds.includes(u.id))
	);

	function toggleSelectAll() {
		if (isAllSelected) {
			const itemIds = items.map((u: any) => u.id);
			selectedIds = selectedIds.filter((id: any) => !itemIds.includes(id));
		} else {
			const newIds = items
				.map((u: any) => u.id)
				.filter((id: any) => !selectedIds.includes(id));
			selectedIds = [...selectedIds, ...newIds];
		}
	}

	function toggleSelect(id: any) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((x: any) => x !== id);
		} else {
			selectedIds = [...selectedIds, id];
		}
	}

	function clearSelection() {
		selectedIds = [];
	}

	$effect(() => {
		const q = searchQuery;
		const s = pageSize;
		untrack(() => {
			currentPage = 1;
		});
	});

	$effect(() => {
		const allAvailableIds = items.map((u: any) => u.id);
		untrack(() => {
			selectedIds = selectedIds.filter((id: any) => allAvailableIds.includes(id));
		});
	});
</script>

<div class="space-y-6">
	<!-- Controls Bar -->
	<div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
		<!-- Left: Controls -->
		<div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
			<!-- View Mode Toggle -->
			<div class="flex items-center p-0.5 bg-slate-50 border border-[#eef1f6] rounded-xl flex-shrink-0">
				<button
					type="button"
					onclick={() => (viewMode = 'table')}
					aria-label="Tampilan Tabel"
					title="Tampilan Tabel"
					class="p-2 rounded-lg transition-all flex items-center justify-center {viewMode === 'table' ? 'bg-[#3f231c] text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'}"
				>
					<iconify-icon icon="solar:hamburger-menu-outline" class="text-lg"></iconify-icon>
				</button>
				<button
					type="button"
					onclick={() => (viewMode = 'card')}
					aria-label="Tampilan Card"
					title="Tampilan Card"
					class="p-2 rounded-lg transition-all flex items-center justify-center {viewMode === 'card' ? 'bg-[#3f231c] text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'}"
				>
					<iconify-icon icon="solar:widget-outline" class="text-lg"></iconify-icon>
				</button>
			</div>

			<!-- Page Size Selector -->
			<div class="flex items-center p-0.5 bg-slate-50 border border-[#eef1f6] rounded-xl flex-shrink-0 relative">
				<select
					bind:value={pageSize}
					class="bg-transparent text-slate-700 text-xs font-bold rounded-lg pl-3 pr-8 py-2 focus:outline-none appearance-none cursor-pointer"
				>
					<option value="5">5</option>
					<option value="10">10</option>
					<option value="50">50</option>
					<option value="All">All</option>
				</select>
				<span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
					<iconify-icon icon="solar:alt-arrow-down-outline" class="text-xs"></iconify-icon>
				</span>
			</div>
		</div>

		<!-- Right: Search & Filter -->
		<div class="flex items-center gap-3 w-full sm:w-auto flex-grow sm:flex-grow-0 sm:justify-end">
			<!-- Search Input -->
			<div class="relative flex-grow sm:flex-grow-0 sm:w-64">
				<span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
					<iconify-icon icon="solar:magnifer-outline" class="text-sm"></iconify-icon>
				</span>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder={searchPlaceholder}
					class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-[#eef1f6] text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 focus:bg-white text-xs transition duration-200"
				/>
			</div>

			<!-- Custom Filter Dropdown (Optional) -->
			{#if filterOptions}
				<div class="relative">
					<button
						onclick={(e) => {
							e.stopPropagation();
							filterDropdownOpen = !filterDropdownOpen;
						}}
						class="px-4 py-2.5 text-xs font-bold bg-white hover:bg-slate-50 border border-[#eef1f6] text-slate-700 rounded-xl flex items-center gap-2 transition duration-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 text-slate-500"
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
						{filterLabel}
					</button>
					{#if filterDropdownOpen}
						<div
							class="absolute right-0 mt-2 w-48 bg-white border border-[#eef1f6] rounded-2xl shadow-xl py-2 z-30"
						>
							{@render filterOptions()}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<!-- Collective Action Header Bar -->
	{#if selectedIds.length > 0}
		<div
			class="flex items-center justify-between bg-red-50/70 border border-red-100/80 rounded-2xl p-4 mb-6"
			transition:fade={{ duration: 150 }}
		>
			<div class="flex items-center gap-3">
				<span class="text-xs font-extrabold text-red-700 uppercase tracking-wider"
					>{selectedIds.length} Terpilih</span
				>
				<button
					onclick={clearSelection}
					class="text-xs font-bold text-slate-500 hover:text-slate-700 underline"
				>
					Batalkan Pilihan
				</button>
			</div>
			
			{#if batchActions}
				{@render batchActions(selectedIds.length, clearSelection)}
			{/if}
		</div>
	{/if}

	<!-- View renderers -->
	{#if viewMode === 'table'}
		<div class="border border-[#eef1f6] rounded-[20px] overflow-hidden overflow-x-auto shadow-xs bg-white">
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
						{#each columns as col}
							<th class="px-6 py-4 {col.class || ''}">{col.label}</th>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-[#f5f8fc]">
					{#each paginatedItems as item}
						{@render row(item, selectedIds.includes(item.id), () => toggleSelect(item.id))}
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<!-- Card view -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each paginatedItems as item}
				{@render card(item, selectedIds.includes(item.id), () => toggleSelect(item.id))}
			{/each}
		</div>
	{/if}

	<!-- Pagination Footer -->
	{#if items.length > 0}
		<div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100">
			<span class="text-xs text-slate-400 font-medium">
				Showing {pageSize === 'All' ? 1 : (currentPage - 1) * parseInt(pageSize) + 1} to {pageSize === 'All' ? items.length : Math.min(currentPage * parseInt(pageSize), items.length)} of {totalItemsCount} entries
			</span>
			
			{#if pageSize !== 'All' && totalPages > 1}
				<div class="flex items-center gap-1">
					<button
						onclick={() => (currentPage = Math.max(1, currentPage - 1))}
						disabled={currentPage === 1}
						class="px-3.5 py-2 border border-[#eef1f6] hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 font-bold rounded-xl text-xs transition duration-200"
					>
						Prev
					</button>
					{#each Array(totalPages) as _, i}
						<button
							onclick={() => (currentPage = i + 1)}
							class="h-8 w-8 flex items-center justify-center rounded-xl text-xs font-bold transition duration-200 {currentPage === i + 1 ? 'bg-[#3f231c] text-white shadow-md shadow-[#3f231c]/10' : 'text-slate-500 hover:bg-slate-50'}"
						>
							{i + 1}
						</button>
					{/each}
					<button
						onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
						disabled={currentPage === totalPages}
						class="px-3.5 py-2 border border-[#eef1f6] hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 font-bold rounded-xl text-xs transition duration-200"
					>
						Next
					</button>
				</div>
			{/if}
		</div>
	{:else}
		<div class="text-center py-12 bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl">
			<span class="text-3xl block mb-2">🔍</span>
			<p class="text-sm font-bold text-slate-500">Tidak ada data ditemukan</p>
			<p class="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
		</div>
	{/if}
</div>
