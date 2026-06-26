<script lang="ts">
	import SidebarMenu from '../../../components/SidebarMenu.svelte';
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';

	let { data } = $props();
</script>

<svelte:head>
	<title>Manage Users - Svelte Mandiri</title>
</svelte:head>

<div class="grid grid-cols-1 md:grid-cols-4 gap-8" in:fade={{ duration: 300 }}>
	<!-- Sidebar Menu -->
	<div class="md:col-span-1">
		<SidebarMenu />
	</div>

	<!-- Users Main Content -->
	<div class="md:col-span-3" in:fly={{ y: 20, duration: 400, delay: 100 }}>
		<div class="p-8 rounded-3xl bg-slate-900/40 border border-slate-900/60 backdrop-blur-sm shadow-xl">
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-slate-900 pb-6 mb-6">
				<div>
					<h2 class="text-2xl font-extrabold text-white">Users</h2>
					<p class="text-sm text-slate-400 mt-1">Manage registration credentials and user accounts</p>
				</div>
				<a
					href="/admin/users/create"
					class="px-4 py-2 text-xs font-extrabold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 rounded-xl shadow-md shadow-cyan-500/10 hover:shadow-cyan-400/20 hover:-translate-y-0.5 transition-all duration-200"
				>
					ADD USER
				</a>
			</div>

			<!-- Users Table -->
			<div class="overflow-x-auto border border-slate-900/80 rounded-2xl bg-slate-950/20">
				<table class="w-full text-left text-sm text-slate-300 border-collapse">
					<thead>
						<tr class="bg-slate-950/60 text-slate-400 border-b border-slate-900 text-xs font-bold uppercase tracking-wider">
							<th class="px-6 py-4">Full Name</th>
							<th class="px-6 py-4">Username</th>
							<th class="px-6 py-4">Email Address</th>
							<th class="px-6 py-4 text-center w-40">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-900/50">
						{#if data?.users && data.users.length > 0}
							{#each data.users as user}
								<tr class="hover:bg-slate-900/20 transition duration-150">
									<td class="px-6 py-4 font-semibold text-white">{user.name}</td>
									<td class="px-6 py-4 text-slate-400">@{user.username || '-'}</td>
									<td class="px-6 py-4">{user.email}</td>
									<td class="px-6 py-4">
										<div class="flex items-center justify-center gap-2">
											<a
												href="/admin/users/edit/{user.id}"
												class="px-3 py-1.5 text-xs font-bold bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-amber-400 rounded-lg transition-colors"
											>
												EDIT
											</a>
											<form method="POST" action="?/delete" use:enhance class="inline">
												<input type="hidden" name="id" value={user.id} />
												<button
													type="submit"
													class="px-3 py-1.5 text-xs font-bold bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-lg transition-colors"
												>
													DELETE
												</button>
											</form>
										</div>
									</td>
								</tr>
							{/each}
						{:else}
							<tr>
								<td colspan="4" class="px-6 py-10 text-center text-slate-500 italic">
									No users found. Click Add User to register one.
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
