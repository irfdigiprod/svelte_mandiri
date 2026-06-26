<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';

	const features = [
		{
			icon: 'M13 10V3L4 14h7v7l9-11h-7z',
			title: 'Hono + Bun',
			desc: 'Backend REST API ultra-cepat menggunakan Hono framework & Bun runtime dengan performa 3× lebih cepat dari Express.',
			badge: 'Backend',
			badgeColor: 'bg-orange-100 text-orange-700',
			iconBg: 'bg-orange-50',
			iconColor: 'text-orange-500'
		},
		{
			icon: 'M4 7v10c0 2 2 2 2 2h12s2 0 2-2V7M4 7c0-2 2-2 2-2h12s2 0 2 2M4 7h16',
			title: 'DrizzleORM + MySQL',
			desc: 'ORM yang type-safe dan ringan untuk query database MySQL dengan migrasi otomatis yang mudah dikelola.',
			badge: 'Database',
			badgeColor: 'bg-blue-100 text-blue-700',
			iconBg: 'bg-blue-50',
			iconColor: 'text-blue-500'
		},
		{
			icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
			title: 'Svelte 5 Runes',
			desc: 'Frontend reaktif dengan fitur Runes terbaru dari Svelte 5 yang memberikan performa dan DX terbaik.',
			badge: 'Frontend',
			badgeColor: 'bg-amber-100 text-amber-700',
			iconBg: 'bg-amber-50',
			iconColor: 'text-amber-500'
		},
		{
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			title: 'JWT Auth',
			desc: 'Autentikasi aman berbasis JWT dengan cookie httpOnly, validasi Zod, dan password hashing Argon2id bawaan Bun.',
			badge: 'Security',
			badgeColor: 'bg-emerald-100 text-emerald-700',
			iconBg: 'bg-emerald-50',
			iconColor: 'text-emerald-500'
		},
		{
			icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
			title: 'TailwindCSS v4',
			desc: 'Desain modern dengan TailwindCSS versi terbaru — utility-first, responsive, dan tampilan yang konsisten.',
			badge: 'Styling',
			badgeColor: 'bg-violet-100 text-violet-700',
			iconBg: 'bg-violet-50',
			iconColor: 'text-violet-500'
		},
		{
			icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
			title: 'TypeScript',
			desc: 'Seluruh codebase ditulis dengan TypeScript untuk keamanan tipe data, autocompletion, dan kemudahan debug.',
			badge: 'Language',
			badgeColor: 'bg-slate-100 text-slate-600',
			iconBg: 'bg-slate-50',
			iconColor: 'text-slate-500'
		}
	];

	const steps = [
		{ number: '01', title: 'Clone Repository', desc: 'Clone project dan install semua dependensi backend & frontend dalam hitungan menit.' },
		{ number: '02', title: 'Setup Database', desc: 'Konfigurasi koneksi MySQL dan jalankan migrasi otomatis dengan DrizzleORM.' },
		{ number: '03', title: 'Jalankan Aplikasi', desc: 'Jalankan backend dan frontend secara bersamaan, lalu buka browser.' },
		{ number: '04', title: 'Mulai Koding', desc: 'Eksplorasi kode, tambahkan fitur, dan kembangkan sesuai kebutuhan Anda.' }
	];
</script>

<svelte:head>
	<title>Svelte Mandiri — Fullstack Modern Admin Panel</title>
	<meta name="description" content="Admin panel modern dibangun dengan Hono, DrizzleORM, MySQL, SvelteKit 5, dan TailwindCSS. Belajar fullstack JavaScript secara mandiri." />
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden -mt-16">
	<!-- Grid paper background -->
	<div class="absolute inset-0 -z-10" style="
		background-color: #fffdf7;
		background-image:
			linear-gradient(rgba(180,140,80,0.10) 1px, transparent 1px),
			linear-gradient(90deg, rgba(180,140,80,0.10) 1px, transparent 1px),
			linear-gradient(rgba(180,140,80,0.04) 1px, transparent 1px),
			linear-gradient(90deg, rgba(180,140,80,0.04) 1px, transparent 1px);
		background-size: 80px 80px, 80px 80px, 20px 20px, 20px 20px;
		background-position: -1px -1px, -1px -1px, -1px -1px, -1px -1px;
	"></div>
	<!-- Fade edges so grid blends smoothly -->
	<div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,249,240,0.0)_0%,rgba(255,253,247,0.7)_60%,rgba(255,253,247,1)_100%)]"></div>
	<!-- Decorative blobs on top of grid -->
	<div class="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-300/15 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
	<div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-200/30 rounded-full blur-[80px] -z-10 -translate-x-1/3 translate-y-1/3"></div>
	<div class="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-amber-200/20 rounded-full blur-[60px] -z-10 -translate-x-1/2 -translate-y-1/2"></div>

	<div class="max-w-4xl mx-auto text-center" in:fade={{ duration: 400 }}>
		<!-- Badge -->
		<div class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-amber-200 rounded-full text-xs font-bold text-amber-700 shadow-sm shadow-amber-100 mb-8" in:fly={{ y: -10, duration: 400, delay: 100 }}>
			<span class="flex h-2 w-2 relative">
				<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
				<span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
			</span>
			Fullstack Modern Stack — SvelteKit + Hono + MySQL
		</div>

		<!-- Headline -->
		<h1 class="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6" in:fly={{ y: 20, duration: 500, delay: 150 }}>
			Admin Panel
			<span class="relative">
				<span class="bg-gradient-to-r from-amber-500 via-orange-500 to-[#3f231c] bg-clip-text text-transparent">Modern</span>
				<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M0 6 Q100 0 200 6" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6"/>
				</svg>
			</span>
			<br/>untuk Pesantren
		</h1>

		<!-- Subtitle -->
		<p class="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-12" in:fly={{ y: 20, duration: 500, delay: 200 }}>
			Sistem manajemen berbasis web yang dibangun dari nol menggunakan
			<strong class="text-slate-700">Bun · Hono · DrizzleORM · MySQL · SvelteKit 5</strong>.
			Pelajari cara membangunnya di file
			<a href="https://github.com/irfdigiprod/svelte_mandiri/blob/main/How_to.md" target="_blank" rel="noopener" class="text-amber-600 hover:text-amber-700 underline underline-offset-2 font-semibold">How_to.md</a>.
		</p>

		<!-- CTA Buttons -->
		<div class="flex flex-col sm:flex-row items-center justify-center gap-4" in:fly={{ y: 20, duration: 500, delay: 250 }}>
			<a
				href="/register"
				class="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3f231c] hover:bg-[#4a2e2b] text-white font-bold rounded-2xl shadow-xl shadow-[#3f231c]/25 hover:shadow-[#3f231c]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
				Daftar Akun
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
				</svg>
			</a>
			<a
				href="/login"
				class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-bold rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
				</svg>
				Masuk ke Dashboard
			</a>
		</div>

		<!-- Social proof / stats -->
		<div class="flex flex-wrap items-center justify-center gap-8 mt-16" in:fly={{ y: 20, duration: 500, delay: 300 }}>
			{#each [
				{ label: 'Teknologi', value: '6+' },
				{ label: 'Fitur Admin', value: '10+' },
				{ label: 'Halaman', value: '12+' }
			] as stat}
				<div class="text-center">
					<p class="text-3xl font-extrabold text-[#3f231c]">{stat.value}</p>
					<p class="text-xs font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">{stat.label}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Scroll indicator -->
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
		<span class="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Scroll</span>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</div>
</section>

<!-- Tech Stack Section -->
<section class="py-24 px-6 bg-white">
	<div class="max-w-6xl mx-auto">
		<!-- Section Header -->
		<div class="text-center mb-16">
			<span class="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider mb-4">Tech Stack</span>
			<h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Dibangun dengan Teknologi Terbaik</h2>
			<p class="text-slate-500 max-w-xl mx-auto">Setiap teknologi dipilih dengan cermat untuk memastikan performa, keamanan, dan kemudahan pengembangan.</p>
		</div>

		<!-- Feature Cards Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each features as feat, i}
				<div
					class="group p-6 bg-white border border-[#eef1f6] rounded-2xl hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-300"
				>
					<div class="flex items-start justify-between mb-4">
						<div class="h-11 w-11 rounded-xl {feat.iconBg} flex items-center justify-center {feat.iconColor} group-hover:scale-110 transition-transform duration-300">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={feat.icon} />
							</svg>
						</div>
						<span class="px-2.5 py-1 rounded-full text-[10px] font-bold {feat.badgeColor}">{feat.badge}</span>
					</div>
					<h3 class="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
					<p class="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- How it works -->
<section class="py-24 px-6 bg-[#fdf8f0]">
	<div class="max-w-5xl mx-auto">
		<div class="text-center mb-16">
			<span class="inline-block px-3 py-1 bg-[#3f231c]/10 text-[#3f231c] text-xs font-bold rounded-full uppercase tracking-wider mb-4">Cara Memulai</span>
			<h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Mulai dalam 4 Langkah</h2>
			<p class="text-slate-500 max-w-xl mx-auto">Ikuti langkah-langkah berikut untuk menjalankan aplikasi ini di komputer Anda.</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
			{#each steps as step, i}
				<div class="flex items-start gap-5 p-6 bg-white border border-[#eef1f6] rounded-2xl hover:shadow-md transition-all duration-300">
					<span class="text-4xl font-black text-amber-200 flex-shrink-0 leading-none">{step.number}</span>
					<div>
						<h3 class="text-base font-bold text-slate-900 mb-1.5">{step.title}</h3>
						<p class="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-24 px-6 bg-[#3f231c] relative overflow-hidden">
	<!-- Decorative circles -->
	<div class="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
	<div class="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3"></div>

	<div class="max-w-3xl mx-auto text-center relative z-10">
		<h2 class="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
			Siap untuk Belajar<br/>
			<span class="text-amber-400">Fullstack Development?</span>
		</h2>
		<p class="text-amber-100/70 text-lg mb-10 max-w-xl mx-auto">
			Daftar sekarang dan eksplorasi seluruh fitur admin panel yang sudah dibangun. Source code tersedia lengkap untuk dipelajari.
		</p>
		<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
			<a
				href="/register"
				class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-[#3f231c] font-extrabold rounded-2xl shadow-lg shadow-amber-400/20 hover:-translate-y-0.5 transition-all duration-300 text-sm"
			>
				Daftar Gratis Sekarang
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
				</svg>
			</a>
			<a
				href="/login"
				class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl transition-all duration-300 text-sm"
			>
				Sudah Punya Akun? Login
			</a>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="py-10 px-6 bg-white border-t border-[#eef1f6]">
	<div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
		<div class="flex items-center gap-3">
			<div class="h-8 w-8 rounded-lg bg-gradient-to-tr from-amber-400 to-[#3f231c] flex items-center justify-center shadow-md">
				<span class="font-extrabold text-xs text-white">SM</span>
			</div>
			<span class="text-sm font-bold text-slate-800">Svelte<span class="text-amber-500">Mandiri</span></span>
		</div>
		<p class="text-xs text-slate-400 text-center">
			Dibangun dengan ❤️ menggunakan Hono · DrizzleORM · SvelteKit 5 · TailwindCSS
		</p>
		<div class="flex items-center gap-4 text-xs font-semibold text-slate-400">
			<a href="/login" class="hover:text-slate-700 transition-colors">Login</a>
			<a href="/register" class="hover:text-slate-700 transition-colors">Register</a>
			<a href="/admin/dashboard" class="hover:text-slate-700 transition-colors">Dashboard</a>
		</div>
	</div>
</footer>
