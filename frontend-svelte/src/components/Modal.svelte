<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	interface Props {
		show: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		onclose: () => void;
		children: Snippet;
		footer?: Snippet;
	}

	let {
		show = $bindable(false),
		title = '',
		size = 'md',
		onclose,
		children,
		footer
	}: Props = $props();

	// Close on Escape key press
	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape' && show) {
			closeModal();
		}
	}

	function closeModal() {
		show = false;
		onclose?.();
	}

	// Size class mappings
	const sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl'
	};
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if show}
	<!-- Modal Container -->
	<div
		role="dialog"
		aria-modal="true"
		class="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto"
	>
		<!-- Backdrop overlay -->
		<button
			type="button"
			tabindex="-1"
			class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity w-full h-full cursor-default border-none p-0"
			onclick={closeModal}
			transition:fade={{ duration: 200 }}
			aria-label="Close backdrop"
		></button>

		<!-- Modal Dialog Body -->
		<div
			class="relative w-full {sizeClasses[size]} bg-white border border-[#eef1f6] rounded-[24px] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
			in:fly={{ y: 20, duration: 300, delay: 50 }}
			out:fly={{ y: -10, duration: 200 }}
		>
			<!-- Header -->
			<div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
				<h3 class="text-base font-bold text-slate-900 line-clamp-1">
					{title}
				</h3>
				<!-- Close Button -->
				<button
					onclick={closeModal}
					class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
					aria-label="Close modal"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Content Area -->
			<div class="p-6 overflow-y-auto flex-grow text-sm text-slate-600 leading-relaxed">
				{@render children()}
			</div>

			<!-- Footer Area -->
			{#if footer}
				<div class="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
