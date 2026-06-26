<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';

	let { form } = $props();

	// Menangani redirect secara manual jika berhasil
	$effect(() => {
		if (form?.success) {
			goto('/admin/users');
		}
	});
</script>

<svelte:head>
	<title>Add User - Svelte Mandiri</title>
</svelte:head>

<div class="max-w-2xl" in:fade={{ duration: 250 }}>
	<!-- Main Panel Card -->
	<div class="bg-white border border-[#eef1f6] rounded-[24px] p-8 shadow-sm" in:fly={{ y: 15, duration: 350, delay: 50 }}>
		
		<!-- Header -->
		<div class="border-b border-slate-100 pb-6 mb-6">
			<h2 class="text-xl font-bold text-slate-900">Tambah User</h2>
			<p class="text-xs text-slate-400 mt-0.5">Daftarkan akun pengguna baru ke database</p>
		</div>

		<!-- Main Error Message -->
		{#if form?.message && !form?.success}
			<div class="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
				{form.message}
			</div>
		{/if}

		<form method="POST" action="?/create" use:enhance class="space-y-5">
			<!-- Full Name -->
			<div>
				<label for="name" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
				<input
					type="text"
					id="name"
					name="name"
					class="w-full px-4 py-3 bg-slate-50 border {form?.errors?.name ? 'border-red-400 focus:ring-red-400' : 'border-[#eef1f6] focus:ring-amber-400 focus:border-amber-400'} text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-1 transition duration-200 text-sm"
					placeholder="Ahmad Irfan"
					value={form?.values?.name || ''}
				/>
				{#if form?.errors?.name}
					<p class="mt-1.5 text-xs text-red-500">{form.errors.name}</p>
				{/if}
			</div>

			<!-- Username -->
			<div>
				<label for="username" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
				<input
					type="text"
					id="username"
					name="username"
					class="w-full px-4 py-3 bg-slate-50 border {form?.errors?.username ? 'border-red-400 focus:ring-red-400' : 'border-[#eef1f6] focus:ring-amber-400 focus:border-amber-400'} text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-1 transition duration-200 text-sm"
					placeholder="irfan123"
					value={form?.values?.username || ''}
				/>
				{#if form?.errors?.username}
					<p class="mt-1.5 text-xs text-red-500">{form.errors.username}</p>
				{/if}
			</div>

			<!-- Email Address -->
			<div>
				<label for="email" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Alamat Email</label>
				<input
					type="email"
					id="email"
					name="email"
					class="w-full px-4 py-3 bg-slate-50 border {form?.errors?.email ? 'border-red-400 focus:ring-red-400' : 'border-[#eef1f6] focus:ring-amber-400 focus:border-amber-400'} text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-1 transition duration-200 text-sm"
					placeholder="irfan@example.com"
					value={form?.values?.email || ''}
				/>
				{#if form?.errors?.email}
					<p class="mt-1.5 text-xs text-red-500">{form.errors.email}</p>
				{/if}
			</div>

			<!-- Password -->
			<div>
				<label for="password" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					class="w-full px-4 py-3 bg-slate-50 border {form?.errors?.password ? 'border-red-400 focus:ring-red-400' : 'border-[#eef1f6] focus:ring-amber-400 focus:border-amber-400'} text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-1 transition duration-200 text-sm"
					placeholder="••••••••"
				/>
				{#if form?.errors?.password}
					<p class="mt-1.5 text-xs text-red-500">{form.errors.password}</p>
				{/if}
			</div>

			<!-- Form Actions -->
			<div class="flex items-center gap-3 pt-2">
				<button
					type="submit"
					class="px-6 py-3 bg-[#3f231c] hover:bg-[#4a2e2b] text-white font-bold rounded-xl shadow-md shadow-[#3f231c]/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-xs uppercase tracking-wider"
				>
					Simpan User
				</button>
				<a
					href="/admin/users"
					class="px-6 py-3 bg-white hover:bg-slate-50 border border-[#eef1f6] text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition duration-200"
				>
					Batal
				</a>
			</div>
		</form>
	</div>
</div>
