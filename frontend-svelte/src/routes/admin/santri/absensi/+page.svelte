<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
	const today = new Date();
	const currentMonth = today.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

	// Generate calendar weeks (4 weeks × 7 days)
	const calendarRows = [
		[1, 2, 3, 4, 5, 6, 7],
		[8, 9, 10, 11, 12, 13, 14],
		[15, 16, 17, 18, 19, 20, 21],
		[22, 23, 24, 25, 26, 27, 28],
		[29, 30, null, null, null, null, null]
	];

	// Mock attendance status per day (hadir / alpha / izin / null=no data)
	const attendanceMap: Record<number, 'hadir' | 'alpha' | 'izin' | null> = {
		1: 'hadir', 2: 'hadir', 3: 'hadir', 4: 'hadir', 5: 'hadir',
		8: 'hadir', 9: 'hadir', 10: 'izin', 11: 'hadir', 12: 'hadir',
		15: 'hadir', 16: 'alpha', 17: 'hadir', 18: 'hadir', 19: 'hadir',
		22: 'hadir', 23: 'hadir', 24: 'hadir', 25: 'hadir', 26: 'hadir',
		29: 'hadir', 30: 'hadir'
	};

	const statusClass: Record<string, string> = {
		hadir: 'bg-emerald-100 text-emerald-700 border-emerald-200',
		alpha: 'bg-red-100 text-red-600 border-red-200',
		izin: 'bg-amber-100 text-amber-700 border-amber-200'
	};

	const attendanceRecords = [
		{ date: '2026-06-26', name: 'Muhammad Rizki', status: 'Hadir', masuk: '06:30', keluar: '21:00' },
		{ date: '2026-06-26', name: 'Ahmad Firdaus', status: 'Hadir', masuk: '06:28', keluar: '21:00' },
		{ date: '2026-06-26', name: 'Yahya Azzam', status: 'Izin', masuk: '-', keluar: '-' },
		{ date: '2026-06-26', name: 'Ibrahim Salim', status: 'Hadir', masuk: '06:35', keluar: '21:00' },
		{ date: '2026-06-26', name: 'Bilal Muhajir', status: 'Alpha', masuk: '-', keluar: '-' }
	];
</script>

<svelte:head>
	<title>Absensi Santri - Svelte Mandiri</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-6" in:fade={{ duration: 250 }}>
	<!-- Header Card -->
	<div class="bg-white border border-[#eef1f6] rounded-[24px] p-6 shadow-sm" in:fly={{ y: 15, duration: 350, delay: 50 }}>
		<div class="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
			<div class="flex items-center gap-4">
				<div class="h-12 w-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-600">
					<iconify-icon icon="solar:calendar-outline" class="text-2xl"></iconify-icon>
				</div>
				<div>
					<h2 class="text-xl font-bold text-slate-900">Absensi Santri</h2>
					<p class="text-xs text-slate-400 mt-0.5">Rekap kehadiran harian santri pesantren</p>
				</div>
			</div>
			<button class="px-4 py-2 bg-[#3f231c] text-white text-xs font-semibold rounded-xl hover:bg-[#4a2e2b] transition-all shadow-sm flex items-center gap-2">
				<iconify-icon icon="solar:file-download-outline" class="text-sm"></iconify-icon>
				Export
			</button>
		</div>

		<!-- Stat Summary -->
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
			{#each [
				{ label: 'Hadir', value: '22', pct: '91%', color: 'bg-emerald-50 text-emerald-600' },
				{ label: 'Izin', value: '1', pct: '4%', color: 'bg-amber-50 text-amber-600' },
				{ label: 'Alpha', value: '1', pct: '4%', color: 'bg-red-50 text-red-600' },
				{ label: 'Libur', value: '6', pct: '—', color: 'bg-slate-100 text-slate-500' }
			] as stat}
				<div class="bg-slate-50 border border-[#eef1f6] rounded-2xl p-4 text-center">
					<p class="text-2xl font-bold text-slate-900">{stat.value}</p>
					<p class="text-[10px] font-semibold {stat.color.split(' ')[1]} mt-1">{stat.label}</p>
					<p class="text-[10px] text-slate-400">{stat.pct}</p>
				</div>
			{/each}
		</div>

		<!-- Calendar -->
		<div>
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-sm font-bold text-slate-800">{currentMonth}</h3>
				<div class="flex gap-3 text-[10px] font-semibold">
					<span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>Hadir</span>
					<span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>Izin</span>
					<span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>Alpha</span>
				</div>
			</div>
			<div class="grid grid-cols-7 gap-1.5">
				{#each days as day}
					<div class="text-center text-[10px] font-bold text-slate-400 py-1">{day}</div>
				{/each}
				{#each calendarRows as row}
					{#each row as date}
						{#if date}
							{@const status = attendanceMap[date]}
							<div class="aspect-square flex items-center justify-center rounded-xl text-xs font-semibold border {status ? statusClass[status] : 'bg-slate-50 text-slate-300 border-transparent'} {date === today.getDate() ? 'ring-2 ring-[#3f231c] ring-offset-1' : ''}">
								{date}
							</div>
						{:else}
							<div></div>
						{/if}
					{/each}
				{/each}
			</div>
		</div>
	</div>

	<!-- Today's Attendance Table -->
	<div class="bg-white border border-[#eef1f6] rounded-[24px] p-6 shadow-sm" in:fly={{ y: 15, duration: 350, delay: 100 }}>
		<h3 class="text-sm font-bold text-slate-800 mb-4">Kehadiran Hari Ini</h3>
		<div class="overflow-x-auto rounded-2xl border border-[#eef1f6]">
			<table class="w-full text-xs">
				<thead>
					<tr class="bg-slate-50 border-b border-[#eef1f6]">
						<th class="text-left px-4 py-3 text-slate-500 font-semibold">Nama</th>
						<th class="text-left px-4 py-3 text-slate-500 font-semibold">Status</th>
						<th class="text-left px-4 py-3 text-slate-500 font-semibold">Jam Masuk</th>
						<th class="text-left px-4 py-3 text-slate-500 font-semibold">Jam Keluar</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-50">
					{#each attendanceRecords as rec}
						<tr class="hover:bg-slate-50/50 transition-colors">
							<td class="px-4 py-3 font-semibold text-slate-800">{rec.name}</td>
							<td class="px-4 py-3">
								<span class="px-2.5 py-1 rounded-full text-[10px] font-bold {rec.status === 'Hadir' ? 'bg-emerald-100 text-emerald-700' : rec.status === 'Alpha' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}">
									{rec.status}
								</span>
							</td>
							<td class="px-4 py-3 text-slate-600">{rec.masuk}</td>
							<td class="px-4 py-3 text-slate-600">{rec.keluar}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
