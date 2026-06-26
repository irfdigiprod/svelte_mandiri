<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';

	let { form } = $props();

	// Success message visibility
	let showSuccess = $state(false);

	$effect(() => {
		if (form?.success) {
			showSuccess = true;
			const timer = setTimeout(() => {
				showSuccess = false;
			}, 3000);
			return () => clearTimeout(timer);
		}
	});
</script>

<svelte:head>
	<title>Ganti Password - Svelte Mandiri</title>
</svelte:head>

<div class="max-w-2xl" in:fade={{ duration: 250 }}>
	<!-- Main Panel Card -->
	<div class="bg-white border border-[#eef1f6] rounded-[24px] p-8 shadow-sm" in:fly={{ y: 15, duration: 350, delay: 50 }}>
		
		<!-- Header -->
		<div class="border-b border-slate-100 pb-6 mb-6">
			<h2 class="text-xl font-bold text-slate-900">Ganti Password</h2>
			<p class="text-xs text-slate-400 mt-0.5">Perbarui password keamanan akun Anda secara berkala</p>
		</div>

		<!-- Success/Error Alert -->
		{#if showSuccess}
			<div class="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-sm text-green-600 flex items-center gap-2" transition:fade>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				Password Anda berhasil diperbarui!
			</div>
		{/if}

		{#if form?.message && !form?.success}
			<div class="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
				{form.message}
			</div>
		{/if}

		<form method="POST" action="?/changePassword" use:enhance class="space-y-5">
			<!-- Current Password -->
			<div>
				<label for="currentPassword" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password Sekarang</label>
				<input
					type="password"
					id="currentPassword"
					name="currentPassword"
					class="w-full px-4 py-3 bg-slate-50 border {form?.errors?.currentPassword ? 'border-red-400 focus:ring-red-400' : 'border-[#eef1f6] focus:ring-amber-400 focus:border-amber-400'} text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-1 transition duration-200 text-sm"
					placeholder="••••••••"
				/>
				{#if form?.errors?.currentPassword}
					<p class="mt-1.5 text-xs text-red-500">{form.errors.currentPassword}</p>
				{/if}
			</div>

			<!-- New Password -->
			<div>
				<label for="password" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password Baru</label>
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

			<!-- Confirm Password -->
			<div>
				<label for="confirmPassword" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Konfirmasi Password Baru</label>
				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					class="w-full px-4 py-3 bg-slate-50 border {form?.errors?.confirmPassword ? 'border-red-400 focus:ring-red-400' : 'border-[#eef1f6] focus:ring-amber-400 focus:border-amber-400'} text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-1 transition duration-200 text-sm"
					placeholder="••••••••"
				/>
				{#if form?.errors?.confirmPassword}
					<p class="mt-1.5 text-xs text-red-500">{form.errors.confirmPassword}</p>
				{/if}
			</div>

			<!-- Form Actions -->
			<div class="flex items-center gap-3 pt-2">
				<button
					type="submit"
					class="px-6 py-3 bg-[#3f231c] hover:bg-[#4a2e2b] text-white font-bold rounded-xl shadow-md shadow-[#3f231c]/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-xs uppercase tracking-wider"
				>
					Simpan Password
				</button>
			</div>
		</form>
	</div>
</div>
