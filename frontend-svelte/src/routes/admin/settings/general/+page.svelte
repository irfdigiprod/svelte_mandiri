<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	const settings = [
		{ key: 'Nama Aplikasi', value: 'Svelte Mandiri', type: 'text' },
		{ key: 'Nama Institusi', value: 'Pondok Pesantren Minhajul Haq', type: 'text' },
		{ key: 'Alamat', value: 'Jl. Pesantren No. 1, Jakarta Selatan', type: 'text' },
		{ key: 'Email Kontak', value: 'info@minhajulhaq.ac.id', type: 'email' },
		{ key: 'Nomor Telepon', value: '(021) 555-0100', type: 'text' },
		{ key: 'Website', value: 'https://minhajulhaq.ac.id', type: 'url' }
	];

	let formValues = $state<Record<string, string>>(
		Object.fromEntries(settings.map(s => [s.key, s.value]))
	);

	let saved = $state(false);

	function handleSave() {
		saved = true;
		setTimeout(() => saved = false, 2500);
	}
</script>

<svelte:head>
	<title>Pengaturan Umum - Svelte Mandiri</title>
</svelte:head>

<div class="max-w-2xl space-y-6" in:fade={{ duration: 250 }}>
	<div class="bg-white border border-[#eef1f6] rounded-[24px] p-8 shadow-sm" in:fly={{ y: 15, duration: 350, delay: 50 }}>
		<!-- Header -->
		<div class="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
			<div class="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
				<iconify-icon icon="solar:tuning-2-outline" class="text-2xl"></iconify-icon>
			</div>
			<div>
				<h2 class="text-xl font-bold text-slate-900">Pengaturan Umum</h2>
				<p class="text-xs text-slate-400 mt-0.5">Konfigurasi dasar aplikasi dan profil institusi</p>
			</div>
		</div>

		<!-- Form -->
		<div class="space-y-4">
			{#each settings as field, idx}
				<div>
					<label for="setting-{idx}" class="block text-xs font-semibold text-slate-600 mb-1.5">{field.key}</label>
					<input
						id="setting-{idx}"
						type={field.type}
						bind:value={formValues[field.key]}
						class="w-full px-4 py-3 text-sm bg-slate-50 border border-[#eef1f6] rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
					/>
				</div>
			{/each}
		</div>

		<!-- Toggle Settings -->
		<div class="mt-6 pt-6 border-t border-slate-100 space-y-4">
			<h3 class="text-sm font-bold text-slate-700">Preferensi Sistem</h3>
			{#each [
				{ label: 'Aktifkan Mode Maintenance', desc: 'Nonaktifkan akses pengguna sementara', checked: false },
				{ label: 'Tampilkan Log Aktivitas', desc: 'Catat semua aktivitas pengguna di sistem', checked: true },
				{ label: 'Notifikasi Email Otomatis', desc: 'Kirim email notifikasi untuk aktivitas penting', checked: true }
			] as toggle}
				<div class="flex items-center justify-between py-2">
					<div>
						<p class="text-xs font-semibold text-slate-700">{toggle.label}</p>
						<p class="text-[10px] text-slate-400 mt-0.5">{toggle.desc}</p>
					</div>
					<button
						aria-label={toggle.label}
						class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 {toggle.checked ? 'bg-[#3f231c]' : 'bg-slate-200'}"
					>
						<span class="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 {toggle.checked ? 'translate-x-6' : 'translate-x-1'}"></span>
					</button>
				</div>
			{/each}
		</div>

		<!-- Save Button -->
		<div class="mt-8 flex items-center gap-3">
			<button
				onclick={handleSave}
				class="px-6 py-2.5 bg-[#3f231c] text-white text-xs font-bold rounded-xl hover:bg-[#4a2e2b] transition-all shadow-sm flex items-center gap-2"
			>
				<iconify-icon icon="solar:floppy-disk-outline" class="text-sm"></iconify-icon>
				Simpan Perubahan
			</button>
			{#if saved}
				<span class="text-xs text-emerald-600 font-semibold flex items-center gap-1" in:fade={{ duration: 200 }}>
					<iconify-icon icon="solar:check-circle-outline" class="text-sm"></iconify-icon>
					Perubahan disimpan!
				</span>
			{/if}
		</div>
	</div>
</div>
