<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-2 md:gap-1.5 scrollbar-none whitespace-nowrap w-full">
	<a
		href="/admin/dashboard"
		class="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 border {page.url.pathname === '/admin/dashboard' ? 'bg-amber-400 text-slate-950 border-amber-400/20 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent'}"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
		</svg>
		Dashboard
	</a>
	<a
		href="/admin/users"
		class="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 border {page.url.pathname.startsWith('/admin/users') ? 'bg-amber-400 text-slate-950 border-amber-400/20 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent'}"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
		</svg>
		Users
	</a>
	<a
		href="/logout"
		class="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/5 transition-all duration-200 border border-transparent"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
		</svg>
		Logout
	</a>
</div>
