<script lang="ts">
	import { fade, fly } from 'svelte/transition';
</script>

<svelte:head>
	<title>Tentang - Svelte Mandiri</title>
</svelte:head>

<div class="w-full max-w-4xl mx-auto" in:fade={{ duration: 250 }}>
	<!-- Main Panel (Soft borders, large rounded corners) -->
	<div
		class="bg-white border border-[#eef1f6] rounded-[24px] p-8 shadow-sm space-y-8"
		in:fly={{ y: 15, duration: 350, delay: 50 }}
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-slate-100 pb-6">
			<div class="flex items-center gap-4">
				<div
					class="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600"
				>
					<iconify-icon icon="solar:info-circle-linear" class="text-2xl"></iconify-icon>
				</div>
				<div>
					<h2 class="text-xl font-bold text-slate-900">Tentang Aplikasi</h2>
					<p class="text-xs text-slate-400 mt-0.5">Informasi sistem dan riwayat pengembangan Svelte Mandiri</p>
				</div>
			</div>
		</div>

		<!-- Project Introduction Box -->
		<div class="bg-[#fdf8f0] border border-amber-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
			<div class="h-20 w-20 rounded-2xl bg-[#3f231c] flex items-center justify-center text-white text-3xl font-black shadow-md flex-shrink-0">
				SM
			</div>
			<div>
				<h3 class="text-base font-bold text-slate-800">Svelte Mandiri — Fullstack Admin Panel</h3>
				<p class="text-xs text-slate-500 leading-relaxed mt-2">
					Aplikasi ini dirancang sebagai platform manajemen data modular (admin panel) yang modern untuk kebutuhan efisiensi dan tata kelola pesantren. Dibangun sepenuhnya dari nol menggunakan integrasi ekosistem JavaScript terbaru yang sangat cepat dan ringan.
				</p>
			</div>
		</div>

		<!-- Main Tech Stack Grid -->
		<div>
			<h4 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Teknologi Utama</h4>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<!-- SvelteKit 5 -->
				<div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3 hover:shadow-md transition-shadow">
					<div class="h-9 w-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
						SV
					</div>
					<div>
						<h5 class="text-xs font-bold text-slate-900">SvelteKit 5</h5>
						<p class="text-[10px] text-slate-400 mt-1 leading-relaxed">
							Framework frontend modern dengan reactivity terbaru (Runes API) untuk performa render kilat.
						</p>
					</div>
				</div>
				
				<!-- Hono -->
				<div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3 hover:shadow-md transition-shadow">
					<div class="h-9 w-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
						HO
					</div>
					<div>
						<h5 class="text-xs font-bold text-slate-900">Hono Framework</h5>
						<p class="text-[10px] text-slate-400 mt-1 leading-relaxed">
							Web framework ultra-cepat untuk routing API backend dengan dukung penuh TypeScript native.
						</p>
					</div>
				</div>

				<!-- Bun -->
				<div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3 hover:shadow-md transition-shadow">
					<div class="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 font-bold text-xs">
						BU
					</div>
					<div>
						<h5 class="text-xs font-bold text-slate-900">Bun Runtime</h5>
						<p class="text-[10px] text-slate-400 mt-1 leading-relaxed">
							Runtime engine, bundler, dan package manager modern pengganti Node.js yang jauh lebih responsif.
						</p>
					</div>
				</div>

				<!-- DrizzleORM -->
				<div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3 hover:shadow-md transition-shadow">
					<div class="h-9 w-9 rounded-xl bg-lime-100 text-lime-700 flex items-center justify-center flex-shrink-0 font-bold text-xs">
						DR
					</div>
					<div>
						<h5 class="text-xs font-bold text-slate-900">DrizzleORM</h5>
						<p class="text-[10px] text-slate-400 mt-1 leading-relaxed">
							ORM SQL type-safe yang tipis untuk interaksi database MySQL dengan performa hampir seperti query native.
						</p>
					</div>
				</div>

				<!-- MySQL -->
				<div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3 hover:shadow-md transition-shadow">
					<div class="h-9 w-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
						MY
					</div>
					<div>
						<h5 class="text-xs font-bold text-slate-900">MySQL Database</h5>
						<p class="text-[10px] text-slate-400 mt-1 leading-relaxed">
							Relational database yang stabil dan andal untuk menyimpan data transaksional sistem manajemen.
						</p>
					</div>
				</div>

				<!-- Tailwind CSS -->
				<div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3 hover:shadow-md transition-shadow">
					<div class="h-9 w-9 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
						TW
					</div>
					<div>
						<h5 class="text-xs font-bold text-slate-900">TailwindCSS</h5>
						<p class="text-[10px] text-slate-400 mt-1 leading-relaxed">
							Utility-first CSS framework untuk membangun antarmuka admin yang sepenuhnya responsif dan estetik.
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Features List -->
		<div>
			<h4 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Fitur Utama Sistem</h4>
			<div class="border border-slate-100 rounded-2xl divide-y divide-slate-100 overflow-hidden text-xs">
				<div class="p-4 flex items-start gap-4">
					<span class="text-amber-500 text-base">🔑</span>
					<div>
						<p class="font-bold text-slate-800">Autentikasi & Otorisasi</p>
						<p class="text-[11px] text-slate-500 mt-0.5">Sistem registrasi, login, manajemen sesi pengguna aktif, dan enkripsi password yang aman.</p>
					</div>
				</div>
				<div class="p-4 flex items-start gap-4">
					<span class="text-amber-500 text-base">👥</span>
					<div>
						<p class="font-bold text-slate-800">Manajemen Pengguna (CRUD Users)</p>
						<p class="text-[11px] text-slate-500 mt-0.5">Kelola data pengguna secara terstruktur lengkap dengan filter pencarian dan pembagian hak akses (role).</p>
					</div>
				</div>
				<div class="p-4 flex items-start gap-4">
					<span class="text-amber-500 text-base">⚡</span>
					<div>
						<p class="font-bold text-slate-800">Desain Responsif & Interaktif</p>
						<p class="text-[11px] text-slate-500 mt-0.5">Sidebar navigasi ganda (double-sidebar), layout sticky, serta animasi transisi scroll terintegrasi.</p>
					</div>
				</div>
				<div class="p-4 flex items-start gap-4">
					<span class="text-amber-500 text-base">📋</span>
					<div>
						<p class="font-bold text-slate-800">Log Aktivitas & Audit Trail</p>
						<p class="text-[11px] text-slate-500 mt-0.5">Pemantauan riwayat log aktivitas user untuk melacak semua operasi penting dalam database admin.</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer / Author Section -->
		<div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
			<div class="text-center sm:text-left">
				<p class="text-xs text-slate-400">Pengembang & Pembuat Konten:</p>
				<p class="text-sm font-bold text-[#3f231c] mt-0.5">Irfan Alkhotiri</p>
			</div>
			<div class="flex gap-3">
				<a
					href="/"
					class="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 rounded-xl text-xs transition-colors"
				>
					Kembali ke Landing Page
				</a>
				<a
					href="https://github.com/irfdigiprod/svelte_mandiri"
					target="_blank"
					rel="noopener"
					class="px-4 py-2 bg-[#3f231c] hover:bg-[#4a2e2b] text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
				>
					Repository GitHub
				</a>
			</div>
		</div>
	</div>
</div>
