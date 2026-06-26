<script lang="ts">
	import SidebarMenu from '../../../components/SidebarMenu.svelte';
	import { fade, fly } from 'svelte/transition';

	let { data } = $props();
</script>

<svelte:head>
	<title>Dashboard - Svelte Mandiri</title>
</svelte:head>

<div class="grid grid-cols-1 md:grid-cols-4 gap-8" in:fade={{ duration: 300 }}>
	<!-- Sidebar Menu -->
	<div class="md:col-span-1">
		<SidebarMenu />
	</div>

	<!-- Dashboard Main Content -->
	<div class="md:col-span-3" in:fly={{ y: 20, duration: 400, delay: 100 }}>
		<div class="p-8 rounded-3xl bg-slate-900/40 border border-slate-900/60 backdrop-blur-sm shadow-xl">
			<div class="flex items-center justify-between border-b border-slate-900 pb-6 mb-6">
				<div>
					<h2 class="text-2xl font-extrabold text-white">Dashboard</h2>
					<p class="text-sm text-slate-400 mt-1">Welcome back to your administration panel</p>
				</div>
				<div class="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
			</div>

			<div class="bg-slate-950/40 border border-slate-900/60 rounded-2xl p-6 hover:border-slate-800 transition-colors duration-300">
				<p class="text-base text-slate-300">
					Selamat Datang kembali, <span class="font-bold text-white text-lg bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">{data.user?.name || 'Admin'}</span>!
				</p>
				<p class="text-xs text-slate-500 mt-2">
					Anda masuk sebagai <span class="text-slate-400 font-semibold">@{data.user?.username || 'user'}</span> ({data.user?.email || ''})
				</p>
			</div>
		</div>
	</div>
</div>
