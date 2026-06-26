<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';

	let { form } = $props();

	// Redirect manual jika berhasil
	$effect(() => {
		if (form?.success) {
			goto('/admin/dashboard');
		}
	});
</script>

<svelte:head>
	<title>Login - Svelte Mandiri</title>
</svelte:head>

<div class="w-full max-w-md" in:fade={{ duration: 250 }}>
	<div class="bg-white border border-[#eef1f6] rounded-[24px] p-8 shadow-sm" in:fly={{ y: 15, duration: 350, delay: 50 }}>
		<div class="text-center mb-8">
			<h2 class="text-2xl font-bold text-slate-900">Welcome Back</h2>
			<p class="mt-1 text-xs text-slate-400">Silakan login untuk mengelola aplikasi Anda</p>
		</div>

		<!-- Main Error Message -->
		{#if form?.message && !form?.success}
			<div class="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600 text-center">
				{form.message}
			</div>
		{/if}

		<form method="POST" action="?/login" use:enhance class="space-y-5">
			<!-- Username -->
			<div>
				<label for="username" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
				<input
					type="text"
					id="username"
					name="username"
					class="w-full px-4 py-3 bg-slate-50 border {form?.errors?.username ? 'border-red-400 focus:ring-red-400' : 'border-[#eef1f6] focus:ring-amber-400 focus:border-amber-400'} text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-1 transition duration-200 text-sm"
					placeholder="Masukkan username Anda"
					value={form?.values?.username || ''}
				/>
				{#if form?.errors?.username}
					<p class="mt-1.5 text-xs text-red-500">{form.errors.username}</p>
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
				LOGIN
			</button>
		</form>

		<div class="mt-8 text-center border-t border-slate-100 pt-6">
			<p class="text-xs text-slate-500">
				Belum punya akun?
				<a href="/register" class="text-amber-500 hover:underline font-bold ml-1">Daftar di sini</a>
			</p>
		</div>
	</div>
</div>
