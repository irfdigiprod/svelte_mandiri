<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	const santriList = [
		{ id: 1, nis: 'S-001', name: 'Muhammad Rizki', kamar: 'Al-Fatih', kelas: 'VII A', status: 'Aktif', masuk: '2023-07-01' },
		{ id: 2, nis: 'S-002', name: 'Ahmad Firdaus', kamar: 'Al-Fatih', kelas: 'VII A', status: 'Aktif', masuk: '2023-07-01' },
		{ id: 3, nis: 'S-003', name: 'Yahya Azzam', kamar: 'Al-Kautsar', kelas: 'VIII B', status: 'Aktif', masuk: '2022-07-01' },
		{ id: 4, nis: 'S-004', name: 'Ibrahim Salim', kamar: 'Al-Kautsar', kelas: 'VIII B', status: 'Cuti', masuk: '2022-07-01' },
		{ id: 5, nis: 'S-005', name: 'Bilal Muhajir', kamar: 'Ar-Raudhah', kelas: 'IX A', status: 'Aktif', masuk: '2021-07-01' },
		{ id: 6, nis: 'S-006', name: 'Zaid Abdullah', kamar: 'Ar-Raudhah', kelas: 'IX A', status: 'Aktif', masuk: '2021-07-01' }
	];

	let searchQuery = $state('');
	let filteredSantri = $derived(
		santriList.filter(s =>
			s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			s.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
			s.kamar.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
</script>

<svelte:head>
	<title>Data Santri - Svelte Mandiri</title>
</svelte:head>

<div class="max-w-5xl" in:fade={{ duration: 250 }}>
	<div class="bg-white border border-[#eef1f6] rounded-[24px] p-6 shadow-sm" in:fly={{ y: 15, duration: 350, delay: 50 }}>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
			<div class="flex items-center gap-4">
				<div class="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
					<iconify-icon icon="solar:book-bookmark-outline" class="text-2xl"></iconify-icon>
				</div>
				<div>
					<h2 class="text-xl font-bold text-slate-900">Data Santri</h2>
					<p class="text-xs text-slate-400 mt-0.5">Kelola data seluruh santri pesantren</p>
				</div>
			</div>
			<button class="px-4 py-2 bg-[#3f231c] text-white text-xs font-semibold rounded-xl hover:bg-[#4a2e2b] transition-all shadow-sm flex items-center gap-2">
				<iconify-icon icon="solar:add-circle-outline" class="text-sm"></iconify-icon>
				Tambah Santri
			</button>
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
			{#each [
				{ label: 'Total Santri', value: '248', icon: 'solar:users-group-two-rounded-outline', color: 'bg-blue-50 text-blue-600' },
				{ label: 'Santri Aktif', value: '235', icon: 'solar:check-circle-outline', color: 'bg-emerald-50 text-emerald-600' },
				{ label: 'Cuti', value: '8', icon: 'solar:pause-circle-outline', color: 'bg-amber-50 text-amber-600' },
				{ label: 'Alumni', value: '5', icon: 'solar:diploma-outline', color: 'bg-purple-50 text-purple-600' }
			] as stat}
				<div class="bg-slate-50 border border-[#eef1f6] rounded-2xl p-4">
					<div class="flex items-center gap-3">
						<div class="h-9 w-9 rounded-xl {stat.color} flex items-center justify-center">
							<iconify-icon icon={stat.icon} class="text-lg"></iconify-icon>
						</div>
						<div>
							<p class="text-lg font-bold text-slate-900">{stat.value}</p>
							<p class="text-[10px] text-slate-400">{stat.label}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Search -->
		<div class="mb-4 relative max-w-sm">
			<input
				type="text"
				placeholder="Cari santri..."
				bind:value={searchQuery}
				class="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-[#eef1f6] rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
			/>
			<iconify-icon icon="solar:magnifer-outline" class="absolute left-3 top-3 text-slate-400 text-sm"></iconify-icon>
		</div>

		<!-- Table -->
		<div class="overflow-x-auto rounded-2xl border border-[#eef1f6]">
			<table class="w-full text-xs">
				<thead>
					<tr class="bg-slate-50 border-b border-[#eef1f6]">
						<th class="text-left px-4 py-3 text-slate-500 font-semibold">NIS</th>
						<th class="text-left px-4 py-3 text-slate-500 font-semibold">Nama</th>
						<th class="text-left px-4 py-3 text-slate-500 font-semibold">Kamar</th>
						<th class="text-left px-4 py-3 text-slate-500 font-semibold">Kelas</th>
						<th class="text-left px-4 py-3 text-slate-500 font-semibold">Tgl Masuk</th>
						<th class="text-left px-4 py-3 text-slate-500 font-semibold">Status</th>
						<th class="text-right px-4 py-3 text-slate-500 font-semibold">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-50">
					{#each filteredSantri as santri}
						<tr class="hover:bg-slate-50/50 transition-colors">
							<td class="px-4 py-3 font-mono text-slate-500">{santri.nis}</td>
							<td class="px-4 py-3 font-semibold text-slate-800">{santri.name}</td>
							<td class="px-4 py-3 text-slate-600">{santri.kamar}</td>
							<td class="px-4 py-3 text-slate-600">{santri.kelas}</td>
							<td class="px-4 py-3 text-slate-500">{santri.masuk}</td>
							<td class="px-4 py-3">
								<span class="px-2.5 py-1 rounded-full text-[10px] font-bold {santri.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
									{santri.status}
								</span>
							</td>
							<td class="px-4 py-3 text-right">
								<div class="flex items-center justify-end gap-1">
									<button class="p-1.5 text-slate-400 hover:text-[#3f231c] hover:bg-slate-100 rounded-lg transition-all" title="Edit">
										<iconify-icon icon="solar:pen-outline" class="text-sm"></iconify-icon>
									</button>
									<button class="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Hapus">
										<iconify-icon icon="solar:trash-bin-trash-outline" class="text-sm"></iconify-icon>
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
