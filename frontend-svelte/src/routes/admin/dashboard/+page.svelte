<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	let { data } = $props();
</script>

<svelte:head>
	<title>Dashboard - Svelte Mandiri</title>
</svelte:head>

<div class="w-full max-w-6xl mx-auto" in:fade={{ duration: 250 }}>
	<!-- Main Card Panel (White, soft borders, large rounded corners) -->
	<div
		class="bg-white border border-[#eef1f6] rounded-[24px] p-8 shadow-sm"
		in:fly={{ y: 15, duration: 350, delay: 50 }}
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
			<div class="flex items-center gap-4">
				<div
					class="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600"
				>
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
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						/>
					</svg>
				</div>
				<div>
					<h2 class="text-xl font-bold text-slate-900">Dashboard</h2>
					<p class="text-xs text-slate-400 mt-0.5">Kelola informasi utama dan status aplikasi</p>
				</div>
			</div>
		</div>

		<!-- Welcome Box -->
		<div class="bg-[#f8fafc] border border-[#eef1f6] rounded-2xl p-6">
			<h3 class="text-base font-semibold text-slate-800">
				Selamat Datang kembali, <span class="text-[#3f231c] font-bold"
					>{data.user?.name || 'Admin'}</span
				>!
			</h3>
			<p class="text-xs text-slate-500 mt-2">
				Anda saat ini login menggunakan akun <span class="text-slate-700 font-semibold"
					>@{data.user?.username || 'user'}</span
				>
				dengan alamat email
				<span class="text-slate-700 font-semibold">{data.user?.email || ''}</span>.
			</p>
		</div>
	</div>
</div>
