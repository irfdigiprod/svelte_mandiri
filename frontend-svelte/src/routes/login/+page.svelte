<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

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

<div class="relative flex flex-col items-center justify-center py-12 md:py-20 overflow-hidden">
	<!-- Background Glow -->
	<div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

	<div class="w-full max-w-md relative z-10 px-4">
		<div class="p-8 rounded-3xl bg-slate-900/40 border border-slate-900 backdrop-blur-sm shadow-xl">
			<div class="text-center mb-8">
				<h2 class="text-3xl font-extrabold text-white">Welcome Back</h2>
				<p class="mt-2 text-sm text-slate-400">Login to manage your application</p>
			</div>

			<!-- Main Error Message -->
			{#if form?.message && !form?.success}
				<div class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
					{form.message}
				</div>
			{/if}

			<form method="POST" action="?/login" use:enhance class="space-y-5">
				<!-- Username -->
				<div>
					<label for="username" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						class="w-full px-4 py-3 bg-slate-950/60 border {form?.errors?.username ? 'border-red-500/60 focus:border-red-500' : 'border-slate-800 focus:border-cyan-500/60'} text-slate-100 placeholder-slate-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-opacity-50 transition duration-200 text-sm"
						placeholder="Enter your username"
						value={form?.values?.username || ''}
					/>
					{#if form?.errors?.username}
						<p class="mt-1.5 text-xs text-red-400">{form.errors.username}</p>
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
						placeholder="••••••••"
					/>
					{#if form?.errors?.password}
						<p class="mt-1.5 text-xs text-red-400">{form.errors.password}</p>
					{/if}
				</div>

				<button
					type="submit"
					class="w-full py-4 mt-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-center"
				>
					LOGIN
				</button>
			</form>

			<div class="mt-8 text-center">
				<p class="text-xs text-slate-500">
					Don't have an account?
					<a href="/register" class="text-cyan-400 hover:underline font-semibold ml-1">Register here</a>
				</p>
			</div>
		</div>
	</div>
</div>
