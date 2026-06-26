<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	const roles = [
		{ id: 1, name: 'Super Admin', slug: 'super-admin', desc: 'Akses penuh ke seluruh sistem', users: 1, color: 'bg-red-100 text-red-700' },
		{ id: 2, name: 'Admin', slug: 'admin', desc: 'Kelola data santri, guru, dan laporan', users: 3, color: 'bg-orange-100 text-orange-700' },
		{ id: 3, name: 'Guru', slug: 'guru', desc: 'Input nilai, absensi, dan jadwal kelas', users: 24, color: 'bg-blue-100 text-blue-700' },
		{ id: 4, name: 'Staff Keuangan', slug: 'keuangan', desc: 'Kelola pembayaran dan laporan keuangan', users: 2, color: 'bg-emerald-100 text-emerald-700' },
		{ id: 5, name: 'Klinik', slug: 'klinik', desc: 'Akses rekam medis dan data kesehatan santri', users: 2, color: 'bg-violet-100 text-violet-700' },
		{ id: 6, name: 'Wali Santri', slug: 'wali', desc: 'Pantau perkembangan dan kehadiran santri', users: 185, color: 'bg-slate-100 text-slate-600' }
	];

	const permissions = [
		'Kelola Pengguna', 'Kelola Santri', 'Kelola Guru', 'Input Nilai',
		'Laporan Kehadiran', 'Laporan Keuangan', 'Konfigurasi Sistem', 'Akses Klinik'
	];
</script>

<svelte:head>
	<title>Manajemen Role - Svelte Mandiri</title>
</svelte:head>

<div class="max-w-4xl space-y-6" in:fade={{ duration: 250 }}>
	<div class="bg-white border border-[#eef1f6] rounded-[24px] p-6 shadow-sm" in:fly={{ y: 15, duration: 350, delay: 50 }}>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
			<div class="flex items-center gap-4">
				<div class="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
					<iconify-icon icon="solar:user-id-outline" class="text-2xl"></iconify-icon>
				</div>
				<div>
					<h2 class="text-xl font-bold text-slate-900">Manajemen Role</h2>
					<p class="text-xs text-slate-400 mt-0.5">Atur hak akses dan peran pengguna sistem</p>
				</div>
			</div>
			<button class="px-4 py-2 bg-[#3f231c] text-white text-xs font-semibold rounded-xl hover:bg-[#4a2e2b] transition-all shadow-sm flex items-center gap-2">
				<iconify-icon icon="solar:add-circle-outline" class="text-sm"></iconify-icon>
				Tambah Role
			</button>
		</div>

		<!-- Role Cards -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
			{#each roles as role}
				<div class="border border-[#eef1f6] rounded-2xl p-4 hover:shadow-md hover:border-amber-200 transition-all group cursor-pointer">
					<div class="flex items-start justify-between mb-3">
						<span class="px-3 py-1 rounded-full text-[10px] font-bold {role.color}">
							{role.name}
						</span>
						<button aria-label="Edit role {role.name}" class="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#3f231c] transition-all">
							<iconify-icon icon="solar:pen-outline" class="text-sm"></iconify-icon>
						</button>
					</div>
					<p class="text-xs text-slate-500 mb-3 leading-relaxed">{role.desc}</p>
					<div class="flex items-center justify-between">
						<span class="text-[10px] text-slate-400 font-mono">{role.slug}</span>
						<span class="text-[10px] font-semibold text-slate-600 flex items-center gap-1">
							<iconify-icon icon="solar:user-outline" class="text-xs"></iconify-icon>
							{role.users} pengguna
						</span>
					</div>
				</div>
			{/each}
		</div>

		<!-- Permissions Matrix -->
		<div>
			<h3 class="text-sm font-bold text-slate-800 mb-4">Matriks Hak Akses</h3>
			<div class="overflow-x-auto rounded-2xl border border-[#eef1f6]">
				<table class="w-full text-xs">
					<thead>
						<tr class="bg-slate-50 border-b border-[#eef1f6]">
							<th class="text-left px-4 py-3 text-slate-500 font-semibold">Hak Akses</th>
							{#each roles.slice(0, 4) as role}
								<th class="text-center px-3 py-3">
									<span class="px-2 py-0.5 rounded-full text-[9px] font-bold {role.color}">{role.name}</span>
								</th>
							{/each}
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-50">
						{#each permissions as perm, i}
							<tr class="hover:bg-slate-50/50 transition-colors">
								<td class="px-4 py-3 font-medium text-slate-700">{perm}</td>
								{#each [true, i < 6, i < 4, i === 5] as hasAccess}
									<td class="px-3 py-3 text-center">
										{#if hasAccess}
											<iconify-icon icon="solar:check-circle-bold" class="text-emerald-500 text-base"></iconify-icon>
										{:else}
											<iconify-icon icon="solar:close-circle-outline" class="text-slate-200 text-base"></iconify-icon>
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
