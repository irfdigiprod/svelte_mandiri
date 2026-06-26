<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="rounded-2xl bg-slate-900/40 border border-slate-900/60 backdrop-blur-sm overflow-hidden flex flex-col">
	<!-- Hidden on mobile, visible on desktop -->
	<div class="hidden md:block px-6 py-4 bg-slate-900/60 border-b border-slate-900 text-xs font-bold tracking-wider text-slate-400 uppercase">
		Main Menu
	</div>
	
	<!-- Flex row on mobile, column on desktop -->
	<div class="p-2 flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-2 md:gap-1.5 scrollbar-none whitespace-nowrap">
		<a
			href="/admin/dashboard"
			class="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 border {page.url.pathname === '/admin/dashboard' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-lg shadow-cyan-500/5' : 'text-slate-400 hover:text-white hover:bg-slate-900/50 border-transparent'}"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
			</svg>
			Dashboard
		</a>
		<a
			href="/admin/users"
			class="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 border {page.url.pathname.startsWith('/admin/users') ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-lg shadow-cyan-500/5' : 'text-slate-400 hover:text-white hover:bg-slate-900/50 border-transparent'}"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
			</svg>
			Users
		</a>
		<a
			href="/logout"
			class="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-300 border border-transparent"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
			</svg>
			Logout
		</a>
	</div>
</div>
