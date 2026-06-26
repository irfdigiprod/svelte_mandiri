<div class="relative flex flex-col items-center justify-center py-12 md:py-20 overflow-hidden">
	<!-- Background Glows -->
	<div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

	<div class="text-center max-w-3xl relative z-10">
		<!-- Accent Badge -->
		<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-8 animate-pulse">
			<span class="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
			Fullstack Modern Stack
		</span>

		<!-- Main Hero Title -->
		<h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
			FULLSTACK
			<span class="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
				JAVASCRIPT
			</span>
			DEVELOPER
		</h1>

		<!-- Description -->
		<p class="text-base sm:text-lg text-slate-400 leading-relaxed mb-10 max-w-xl mx-auto">
			Belajar Full Stack JavaScript Developer dengan teknologi modern Hono, Drizzle ORM, MySQL, dan Svelte 5 di
			<a href="https://santrikoding.com" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline">
				SantriKoding.com
			</a>.
		</p>

		<!-- Action Buttons -->
		<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
			<a
				href="/register"
				class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-center"
			>
				REGISTER NOW
			</a>
			<a
				href="/login"
				class="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white font-bold rounded-2xl transition-all duration-300 text-center"
			>
				LOGIN TO ACCOUNT
			</a>
		</div>
	</div>

	<!-- Stack Grid Info -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-20 relative z-10 px-4">
		<!-- Card 1 -->
		<div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300 group">
			<div class="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
			</div>
			<h3 class="text-lg font-bold text-white mb-2">Hono & Drizzle</h3>
			<p class="text-sm text-slate-500 leading-relaxed">
				Backend super cepat berbasis Hono API Framework yang dipadukan dengan Drizzle ORM yang lightweight dan type-safe.
			</p>
		</div>

		<!-- Card 2 -->
		<div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300 group">
			<div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
				</svg>
			</div>
			<h3 class="text-lg font-bold text-white mb-2">Svelte 5 Runes</h3>
			<p class="text-sm text-slate-500 leading-relaxed">
				Frontend modern reaktif menggunakan fitur Runes terbaru dari Svelte 5 untuk performa dan kemudahan reactivity terbaik.
			</p>
		</div>

		<!-- Card 3 -->
		<div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300 group">
			<div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 2 2 2 2h12s2 0 2-2V7M4 7c0-2 2-2 2-2h12s2 0 2 2M4 7h16" />
				</svg>
			</div>
			<h3 class="text-lg font-bold text-white mb-2">Database MySQL</h3>
			<p class="text-sm text-slate-500 leading-relaxed">
				Penyimpanan data yang stabil dan relasional menggunakan MySQL dengan migrasi database otomatis yang dikelola secara terpusat.
			</p>
		</div>
	</div>
</div>
