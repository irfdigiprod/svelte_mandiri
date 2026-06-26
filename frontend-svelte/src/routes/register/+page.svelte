<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';

	let { form } = $props();

	// Redirect manual jika berhasil
	$effect(() => {
		if (form?.success) {
			goto('/login');
		}
	});
</script>

<svelte:head>
	<title>Register - Svelte Mandiri</title>
</svelte:head>

<div class="w-full max-w-md" in:fade={{ duration: 250 }}>
	<div class="bg-white border border-[#eef1f6] rounded-[24px] p-8 shadow-sm" in:fly={{ y: 15, duration: 350, delay: 50 }}>
		<div class="text-center mb-8">
			<h2 class="text-2xl font-bold text-slate-900">Daftar Akun</h2>
			<p class="mt-1 text-xs text-slate-400">Silakan buat akun untuk memulai aplikasi Anda</p>
		</div>

		<!-- Main Error Message -->
		{#if form?.message && !form?.success}
			<div class="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600 text-center">
				{form.message}
			</div>
		{/if}

		<form method="POST" action="?/register" use:enhance class="space-y-5">
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

			<button
				type="submit"
				class="w-full py-4 mt-2 bg-[#3f231c] hover:bg-[#4a2e2b] text-white font-bold rounded-xl shadow-md shadow-[#3f231c]/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-xs uppercase tracking-wider"
			>
				REGISTER
			</button>
		</form>

		<div class="mt-8 text-center border-t border-slate-100 pt-6">
			<p class="text-xs text-slate-500">
				Sudah punya akun?
				<a href="/login" class="text-amber-500 hover:underline font-bold ml-1">Login di sini</a>
			</p>
		</div>
	</div>
</div>
