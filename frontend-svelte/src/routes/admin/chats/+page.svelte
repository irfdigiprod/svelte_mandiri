<script lang="ts">
	import { fade, fly } from 'svelte/transition';
</script>

<svelte:head>
	<title>Chats - Svelte Mandiri</title>
</svelte:head>

<div class="max-w-5xl" in:fade={{ duration: 250 }}>
	<div class="bg-white border border-[#eef1f6] rounded-[24px] shadow-sm overflow-hidden" in:fly={{ y: 15, duration: 350, delay: 50 }}>
		<!-- Header -->
		<div class="flex items-center justify-between p-6 border-b border-slate-100">
			<div class="flex items-center gap-4">
				<div class="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
					<iconify-icon icon="solar:chat-round-line-outline" class="text-2xl"></iconify-icon>
				</div>
				<div>
					<h2 class="text-xl font-bold text-slate-900">Chats</h2>
					<p class="text-xs text-slate-400 mt-0.5">Pesan dan komunikasi internal</p>
				</div>
			</div>
			<button class="px-4 py-2 bg-[#3f231c] text-white text-xs font-semibold rounded-xl hover:bg-[#4a2e2b] transition-all shadow-sm flex items-center gap-2">
				<iconify-icon icon="solar:pen-outline" class="text-sm"></iconify-icon>
				Pesan Baru
			</button>
		</div>

		<div class="flex h-[520px]">
			<!-- Conversation List -->
			<div class="w-72 border-r border-slate-100 flex flex-col flex-shrink-0">
				<!-- Search -->
				<div class="p-3 border-b border-slate-50">
					<div class="relative">
						<input type="text" placeholder="Cari percakapan..." class="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-[#eef1f6] rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all" />
						<iconify-icon icon="solar:magnifer-outline" class="absolute left-2.5 top-2.5 text-slate-400 text-sm"></iconify-icon>
					</div>
				</div>

				<!-- Conversation items -->
				<div class="flex-grow overflow-y-auto">
					{#each [
						{ name: 'Ahmad Fauzi', role: 'Guru Matematika', msg: 'Baik, terima kasih pak!', time: '10:24', unread: 2, active: true },
						{ name: 'Siti Nurhaliza', role: 'Wali Santri', msg: 'Kapan jadwal ujian semester?', time: '09:15', unread: 0, active: false },
						{ name: 'Ustadz Hasan', role: 'Guru Tahfidz', msg: 'Setoran sudah selesai hari ini', time: 'Kemarin', unread: 0, active: false },
						{ name: 'Dr. Fatimah', role: 'Klinik', msg: 'Santri sudah sembuh dan kembali', time: 'Kemarin', unread: 0, active: false },
						{ name: 'Admin Keuangan', role: 'Keuangan', msg: 'Laporan bulan ini sudah dikirim', time: 'Senin', unread: 0, active: false }
					] as conv}
						<button class="w-full flex items-start gap-3 p-3 hover:bg-slate-50 transition-colors text-left {conv.active ? 'bg-amber-50 border-r-2 border-amber-400' : ''}">
							<div class="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 to-[#3f231c] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
								{conv.name[0]}
							</div>
							<div class="flex-grow overflow-hidden">
								<div class="flex items-center justify-between">
									<span class="text-xs font-bold text-slate-800 truncate">{conv.name}</span>
									<span class="text-[10px] text-slate-400 flex-shrink-0 ml-1">{conv.time}</span>
								</div>
								<p class="text-[10px] text-slate-400">{conv.role}</p>
								<p class="text-[10px] text-slate-500 truncate mt-0.5">{conv.msg}</p>
							</div>
							{#if conv.unread > 0}
								<span class="h-4 w-4 bg-amber-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center flex-shrink-0 mt-1">{conv.unread}</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>

			<!-- Chat Area -->
			<div class="flex-grow flex flex-col">
				<!-- Chat Header -->
				<div class="flex items-center gap-3 p-4 border-b border-slate-100">
					<div class="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-400 to-[#3f231c] flex items-center justify-center text-white font-bold text-sm">A</div>
					<div>
						<p class="text-sm font-bold text-slate-800">Ahmad Fauzi</p>
						<p class="text-[10px] text-green-500 font-semibold flex items-center gap-1"><span class="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>Online</p>
					</div>
				</div>

				<!-- Messages -->
				<div class="flex-grow p-4 space-y-3 overflow-y-auto bg-slate-50/30">
					<div class="flex justify-start">
						<div class="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-xs shadow-sm">
							<p class="text-xs text-slate-700">Selamat pagi Pak, apakah jadwal rapat minggu ini jadi?</p>
							<p class="text-[10px] text-slate-400 mt-1">09:45</p>
						</div>
					</div>
					<div class="flex justify-end">
						<div class="bg-[#3f231c] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-xs">
							<p class="text-xs text-white">Ya, rapat tetap jadi hari Rabu pukul 09.00 di ruang guru.</p>
							<p class="text-[10px] text-white/60 mt-1">10:02</p>
						</div>
					</div>
					<div class="flex justify-start">
						<div class="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-xs shadow-sm">
							<p class="text-xs text-slate-700">Baik, terima kasih pak!</p>
							<p class="text-[10px] text-slate-400 mt-1">10:24</p>
						</div>
					</div>
				</div>

				<!-- Message Input -->
				<div class="p-4 border-t border-slate-100 flex items-center gap-3">
					<input type="text" placeholder="Tulis pesan..." class="flex-grow px-4 py-2.5 text-xs bg-slate-50 border border-[#eef1f6] rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all" />
					<button aria-label="Kirim pesan" class="h-9 w-9 bg-[#3f231c] rounded-xl flex items-center justify-center text-white hover:bg-[#4a2e2b] transition-all shadow-sm flex-shrink-0">
						<iconify-icon icon="solar:plain-3-outline" class="text-base"></iconify-icon>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
