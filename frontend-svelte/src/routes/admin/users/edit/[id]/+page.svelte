<script lang="ts">
	import SidebarMenu from '../../../../../components/SidebarMenu.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';

	let { form, data } = $props();

	// Menangani redirect secara manual jika berhasil
	$effect(() => {
		if (form?.success) {
			goto('/admin/users');
		}
	});
</script>

<svelte:head>
	<title>Edit User - Svelte Mandiri</title>
</svelte:head>

<div class="grid grid-cols-1 md:grid-cols-4 gap-8" in:fade={{ duration: 300 }}>
	<!-- Sidebar Menu -->
	<div class="md:col-span-1">
		<SidebarMenu />
	</div>

	<!-- Edit User Main Content -->
	<div class="md:col-span-3" in:fly={{ y: 20, duration: 400, delay: 100 }}>
		<div class="p-8 rounded-3xl bg-slate-900/40 border border-slate-900/60 backdrop-blur-sm shadow-xl">
			<!-- Header -->
			<div class="border-b border-slate-900 pb-6 mb-6">
				<h2 class="text-2xl font-extrabold text-white">Edit User</h2>
				<p class="text-sm text-slate-400 mt-1">Modify registered account credentials</p>
			</div>

			<!-- Main Error Message -->
			{#if form?.message && !form?.success}
				<div class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
					{form.message}
				</div>
			{/if}

			<form method="POST" action="?/update" use:enhance class="space-y-5">
				<!-- Full Name -->
				<div>
					<label for="name" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
					<input
						type="text"
						id="name"
						name="name"
						class="w-full px-4 py-3 bg-slate-950/60 border {form?.errors?.name ? 'border-red-500/60 focus:border-red-500' : 'border-slate-800 focus:border-cyan-500/60'} text-slate-100 placeholder-slate-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-opacity-50 transition duration-200 text-sm"
						placeholder="Full Name"
						value={form?.values?.name ?? data.user?.name ?? ''}
					/>
					{#if form?.errors?.name}
						<p class="mt-1.5 text-xs text-red-400">{form.errors.name}</p>
					{/if}
				</div>

				<!-- Username -->
				<div>
					<label for="username" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						class="w-full px-4 py-3 bg-slate-950/60 border {form?.errors?.username ? 'border-red-500/60 focus:border-red-500' : 'border-slate-800 focus:border-cyan-500/60'} text-slate-100 placeholder-slate-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-opacity-50 transition duration-200 text-sm"
						placeholder="username"
						value={form?.values?.username ?? data.user?.username ?? ''}
					/>
					{#if form?.errors?.username}
						<p class="mt-1.5 text-xs text-red-400">{form.errors.username}</p>
					{/if}
				</div>

				<!-- Email Address -->
				<div>
					<label for="email" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
					<input
						type="email"
						id="email"
						name="email"
						class="w-full px-4 py-3 bg-slate-950/60 border {form?.errors?.email ? 'border-red-500/60 focus:border-red-500' : 'border-slate-800 focus:border-cyan-500/60'} text-slate-100 placeholder-slate-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-opacity-50 transition duration-200 text-sm"
						placeholder="Email Address"
						value={form?.values?.email ?? data.user?.email ?? ''}
					/>
					{#if form?.errors?.email}
						<p class="mt-1.5 text-xs text-red-400">{form.errors.email}</p>
					{/if}
				</div>

				<!-- Password -->
				<div>
					<label for="password" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						class="w-full px-4 py-3 bg-slate-950/60 border {form?.errors?.password ? 'border-red-500/60 focus:border-red-500' : 'border-slate-800 focus:border-cyan-500/60'} text-slate-100 placeholder-slate-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-opacity-50 transition duration-200 text-sm"
						placeholder="•••••••• (leave blank to keep current)"
					/>
					{#if form?.errors?.password}
						<p class="mt-1.5 text-xs text-red-400">{form.errors.password}</p>
					{/if}
				</div>

				<div class="flex items-center gap-4 pt-2">
					<button
						type="submit"
						class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm"
					>
						UPDATE USER
					</button>
					<a
						href="/admin/users"
						class="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-sm transition duration-200"
					>
						CANCEL
					</a>
				</div>
			</form>
		</div>
	</div>
</div>
