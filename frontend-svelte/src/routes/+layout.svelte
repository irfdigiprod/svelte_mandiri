<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Svelte Mandiri - Fullstack App</title>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet" />
</svelte:head>

<div class="min-h-screen bg-slate-950 font-['Outfit'] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
	<!-- Glassmorphism Navbar -->
	<nav class="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/60">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<div class="flex items-center gap-3">
					<div class="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
						<span class="font-extrabold text-sm text-slate-950">SM</span>
					</div>
					<a href="/" class="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
						SVELTE<span class="text-cyan-400">MANDIRI</span>
					</a>
				</div>
				<div class="flex items-center gap-6">
					<a
						href="https://santrikoding.com"
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm font-semibold text-slate-400 hover:text-cyan-400 transition-colors duration-200"
					>
						SANTRIKODING.COM
					</a>
					<a
						href="/login"
						class="px-4 py-2 text-sm font-bold bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5"
					>
						Login
					</a>
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content Area -->
	<main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="border-t border-slate-900 py-6 text-center text-xs text-slate-600 bg-slate-950">
		<div class="max-w-7xl mx-auto px-4">
			<p>© {new Date().getFullYear()} Svelte Mandiri. Built with Svelte 5, Hono, and Drizzle ORM.</p>
		</div>
	</footer>
</div>
