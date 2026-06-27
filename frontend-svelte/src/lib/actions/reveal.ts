/**
 * reveal.ts — Native Scroll Animation Library for Svelte 5
 *
 * A lightweight, zero-dependency replacement for AOS (Animate On Scroll).
 * Combines the simplicity of AOS, the power of Framer Motion, and the
 * scroll intelligence of GSAP ScrollTrigger — built entirely with native
 * Web APIs (IntersectionObserver, requestAnimationFrame, CSS transitions).
 *
 * Architecture:
 *   - Parent-level action: `use:reveal` on a container automatically
 *     discovers and animates its children.
 *   - Single IntersectionObserver per parent for optimal performance.
 *   - Animation registry (object mapping) — no switch statements.
 *   - will-change lifecycle management for GPU compositing.
 *   - Double-rAF initialisation to guarantee paint-before-transition.
 *
 * Usage:
 *   <section use:reveal>                                   — fade-up all direct children
 *   <section use:reveal={{ animation: 'zoom-in' }}>        — zoom-in all direct children
 *   <section use:reveal={{ stagger: 120 }}>                — stagger children by 120ms
 *   <section use:reveal={{ selector: '.card' }}>           — only animate .card elements
 *   <section use:reveal={{ once: true, offset: 20 }}>      — animate once, low offset
 *
 * @module reveal
 */

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

/** All available animation presets */
export type AnimationType =
	| 'fade'
	| 'fade-up'
	| 'fade-down'
	| 'fade-left'
	| 'fade-right'
	| 'zoom-in'
	| 'zoom-out'
	| 'slide-up'
	| 'slide-down'
	| 'slide-left'
	| 'slide-right'
	| 'flip-left'
	| 'flip-right'
	| 'scale'
	| 'blur'
	| 'rotate';

/** CSS properties that define an animation's hidden or visible state */
interface AnimationState {
	opacity: string;
	transform: string;
	filter: string;
	transformOrigin?: string;
}

/** Configuration options for the reveal action */
export interface RevealOptions {
	/** Animation preset to apply to children (default: 'fade-up') */
	animation?: AnimationType;

	/** CSS selector for targeting children within the parent (default: ':scope > *') */
	selector?: string;

	/** Delay between each child's animation start in ms (default: 0) */
	stagger?: number;

	/** Base delay before the first child animates in ms (default: 0) */
	delay?: number;

	/** Animation duration in ms (default: 700) */
	duration?: number;

	/** Translation distance in px for directional animations (default: 40) */
	distance?: number;

	/** IntersectionObserver visibility threshold, 0–1 (default: 0.15) */
	threshold?: number;

	/** Bottom viewport offset in px — maps to negative rootMargin (default: 100) */
	offset?: number;

	/** If true, children animate only once and observer disconnects (default: false) */
	once?: boolean;

	/** If true, children re-hide when the parent scrolls out of view (default: true) */
	mirror?: boolean;

	/** CSS easing function string (default: 'cubic-bezier(.22,1,.36,1)') */
	easing?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════════

/** Default configuration — every option is required internally */
const DEFAULTS: Readonly<Required<RevealOptions>> = {
	animation: 'fade-up',
	selector: ':scope > *',
	stagger: 0,
	delay: 0,
	duration: 700,
	distance: 40,
	threshold: 0.15,
	offset: 100,
	once: false,
	mirror: true,
	easing: 'cubic-bezier(.22,1,.36,1)'
};

/** The visible (shown) state — all animated properties are neutralised */
const VISIBLE_STATE: Readonly<AnimationState> = Object.freeze({
	opacity: '1',
	transform: 'none',
	filter: 'none'
});

/** CSS properties that participate in transitions and will-change */
const TRANSITION_PROPS = ['opacity', 'transform', 'filter'] as const;

/** will-change value while animation is active */
const WILL_CHANGE_ACTIVE = TRANSITION_PROPS.join(', ');

/** Inline style properties to clean up on destroy/update */
const CLEANUP_PROPERTIES = [
	'transition',
	'opacity',
	'transform',
	'filter',
	'will-change',
	'transform-origin'
] as const;

// ═══════════════════════════════════════════════════════════════════════════
// Animation Registry
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Maps every AnimationType to a factory function.
 *
 * Each factory receives the configured `distance` (px) and returns
 * the initial hidden CSS state for that animation.
 *
 * To add a new animation:
 *   1. Add the name to the AnimationType union.
 *   2. Add an entry here.
 */
const ANIMATIONS: Readonly<Record<AnimationType, (distance: number) => AnimationState>> = {
	/* ── Fade ──────────────────────────────────────────────────── */

	fade: () => ({
		opacity: '0',
		transform: 'none',
		filter: 'none'
	}),

	'fade-up': (d) => ({
		opacity: '0',
		transform: `translateY(${d}px)`,
		filter: 'none'
	}),

	'fade-down': (d) => ({
		opacity: '0',
		transform: `translateY(-${d}px)`,
		filter: 'none'
	}),

	'fade-left': (d) => ({
		opacity: '0',
		transform: `translateX(${d}px)`,
		filter: 'none'
	}),

	'fade-right': (d) => ({
		opacity: '0',
		transform: `translateX(-${d}px)`,
		filter: 'none'
	}),

	/* ── Zoom ──────────────────────────────────────────────────── */

	'zoom-in': () => ({
		opacity: '0',
		transform: 'scale(0.85)',
		filter: 'none'
	}),

	'zoom-out': () => ({
		opacity: '0',
		transform: 'scale(1.15)',
		filter: 'none'
	}),

	/* ── Slide (2× distance for stronger movement) ────────────── */

	'slide-up': (d) => ({
		opacity: '0',
		transform: `translateY(${d * 2}px)`,
		filter: 'none'
	}),

	'slide-down': (d) => ({
		opacity: '0',
		transform: `translateY(-${d * 2}px)`,
		filter: 'none'
	}),

	'slide-left': (d) => ({
		opacity: '0',
		transform: `translateX(${d * 2}px)`,
		filter: 'none'
	}),

	'slide-right': (d) => ({
		opacity: '0',
		transform: `translateX(-${d * 2}px)`,
		filter: 'none'
	}),

	/* ── Flip (perspective-based 3D) ──────────────────────────── */

	'flip-left': () => ({
		opacity: '0',
		transform: 'perspective(800px) rotateY(-90deg)',
		filter: 'none',
		transformOrigin: 'left center'
	}),

	'flip-right': () => ({
		opacity: '0',
		transform: 'perspective(800px) rotateY(90deg)',
		filter: 'none',
		transformOrigin: 'right center'
	}),

	/* ── Scale ─────────────────────────────────────────────────── */

	scale: () => ({
		opacity: '0',
		transform: 'scale(0)',
		filter: 'none'
	}),

	/* ── Blur ──────────────────────────────────────────────────── */

	blur: () => ({
		opacity: '0',
		transform: 'none',
		filter: 'blur(12px)'
	}),

	/* ── Rotate ────────────────────────────────────────────────── */

	rotate: () => ({
		opacity: '0',
		transform: 'rotate(-15deg) scale(0.9)',
		filter: 'none'
	})
};

// ═══════════════════════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════════════════════

/** Apply an AnimationState to an element's inline styles */
function applyState(el: HTMLElement, state: AnimationState): void {
	el.style.opacity = state.opacity;
	el.style.transform = state.transform;
	el.style.filter = state.filter;

	if (state.transformOrigin) {
		el.style.transformOrigin = state.transformOrigin;
	}
}

/** Build a CSS transition shorthand string from duration and easing */
function buildTransition(duration: number, easing: string): string {
	return TRANSITION_PROPS.map((prop) => `${prop} ${duration}ms ${easing}`).join(', ');
}

/** Remove all reveal-injected inline styles from an element */
function removeInlineStyles(el: HTMLElement): void {
	CLEANUP_PROPERTIES.forEach((prop) => el.style.removeProperty(prop));
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Svelte Action
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Svelte action that observes a parent container and animates its children
 * into view as the parent scrolls into the viewport.
 *
 * Uses a single IntersectionObserver per parent. Children are discovered
 * via the `selector` option and animated with optional stagger delays.
 *
 * @param node    - The parent container element
 * @param options - Configuration (all optional, sensible defaults provided)
 * @returns       Svelte action lifecycle object with `update` and `destroy`
 */
export function reveal(node: HTMLElement, options: RevealOptions = {}) {
	// ── Internal State ────────────────────────────────────────────

	/** Merged configuration with all defaults filled in */
	let config: Required<RevealOptions> = { ...DEFAULTS, ...options };

	/** Cached array of child elements to animate */
	let children: HTMLElement[] = [];

	/** The single IntersectionObserver instance for this parent */
	let observer: IntersectionObserver | null = null;

	/** Whether the parent is currently considered "in view" */
	let isVisible = false;

	/** Whether CSS transitions have been committed to the browser */
	let transitionsReady = false;

	// ── Async Handle Tracking (for clean teardown) ────────────────

	/** Stagger/delay setTimeout handles, keyed by child element */
	const delayTimers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();

	/** requestAnimationFrame handles, keyed by child element */
	const rafHandles = new Map<HTMLElement, number>();

	/** will-change cleanup setTimeout handles, keyed by child element */
	const wcTimers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();

	/** Setup-phase double-rAF handle */
	let setupRaf: number | null = null;

	// ── Child-Specific Config Reader ──────────────────────────────

	/**
	 * Reads override configurations from a child's dataset attributes
	 * (e.g. data-reveal-animation, data-reveal-delay, data-reveal-duration,
	 * data-reveal-distance, data-reveal-easing) falling back to the parent config.
	 */
	function getChildConfig(child: HTMLElement) {
		const animAttr = child.getAttribute('data-reveal-animation');
		const animation = (animAttr && animAttr in ANIMATIONS ? animAttr : config.animation) as AnimationType;

		const delayAttr = child.getAttribute('data-reveal-delay');
		const delay = delayAttr ? parseInt(delayAttr, 10) : config.delay;

		const durationAttr = child.getAttribute('data-reveal-duration');
		const duration = durationAttr ? parseInt(durationAttr, 10) : config.duration;

		const distanceAttr = child.getAttribute('data-reveal-distance');
		const distance = distanceAttr ? parseInt(distanceAttr, 10) : config.distance;

		const easingAttr = child.getAttribute('data-reveal-easing');
		const easing = easingAttr || config.easing;

		return { animation, delay, duration, distance, easing };
	}

	// ── Hidden State Factory ──────────────────────────────────────

	/**
	 * Returns the hidden AnimationState for the child's configured
	 * animation type and distance.
	 */
	function hiddenState(child: HTMLElement): AnimationState {
		const childConfig = getChildConfig(child);
		return ANIMATIONS[childConfig.animation](childConfig.distance);
	}

	// ── Per-Child Style Helpers ───────────────────────────────────

	/**
	 * Instantly set a child to its hidden state.
	 * Applies will-change hint for GPU compositing.
	 */
	function setChildHidden(child: HTMLElement): void {
		child.style.willChange = WILL_CHANGE_ACTIVE;
		applyState(child, hiddenState(child));
	}

	/**
	 * Animate a single child to the visible state.
	 *
	 * Uses requestAnimationFrame for batched compositing.
	 * Schedules will-change cleanup after the transition ends
	 * to release GPU memory.
	 */
	function animateChildIn(child: HTMLElement): void {
		const childConfig = getChildConfig(child);
		const id = requestAnimationFrame(() => {
			rafHandles.delete(child);
			applyState(child, VISIBLE_STATE);

			// Schedule will-change cleanup after transition ends (+50ms buffer)
			const wcTimer = setTimeout(() => {
				child.style.willChange = 'auto';
				wcTimers.delete(child);
			}, childConfig.duration + 50);

			wcTimers.set(child, wcTimer);
		});

		rafHandles.set(child, id);
	}

	/**
	 * Animate a single child back to the hidden state (mirror mode).
	 *
	 * Cancels any pending will-change cleanup from a previous "show"
	 * and re-enables will-change for the hide transition.
	 */
	function animateChildOut(child: HTMLElement): void {
		// Cancel any pending will-change cleanup from a previous show
		const existingWc = wcTimers.get(child);
		if (existingWc !== undefined) {
			clearTimeout(existingWc);
			wcTimers.delete(child);
		}

		const id = requestAnimationFrame(() => {
			rafHandles.delete(child);
			child.style.willChange = WILL_CHANGE_ACTIVE;
			applyState(child, hiddenState(child));
		});

		rafHandles.set(child, id);
	}

	// ── Batch Operations ─────────────────────────────────────────

	/**
	 * Reveal all children with stagger delays.
	 *
	 * Each child's effective delay = childConfig.delay + (config.stagger × index).
	 * Children with zero effective delay are animated immediately via rAF.
	 */
	function showAll(): void {
		// Ensure CSS transitions are committed before animating
		ensureTransitions();

		children.forEach((child, index) => {
			const childConfig = getChildConfig(child);
			const effectiveDelay = childConfig.delay + config.stagger * index;

			if (effectiveDelay <= 0) {
				animateChildIn(child);
				return;
			}

			const timer = setTimeout(() => {
				delayTimers.delete(child);
				animateChildIn(child);
			}, effectiveDelay);

			delayTimers.set(child, timer);
		});
	}

	/**
	 * Hide all children (mirror mode).
	 *
	 * Cancels any in-flight show animations before hiding,
	 * ensuring clean state transitions.
	 */
	function hideAll(): void {
		children.forEach((child) => {
			cancelChild(child);
			animateChildOut(child);
		});
	}

	// ── Timer Management ─────────────────────────────────────────

	/** Cancel all pending async work for a single child */
	function cancelChild(child: HTMLElement): void {
		const dt = delayTimers.get(child);
		if (dt !== undefined) {
			clearTimeout(dt);
			delayTimers.delete(child);
		}

		const raf = rafHandles.get(child);
		if (raf !== undefined) {
			cancelAnimationFrame(raf);
			rafHandles.delete(child);
		}

		const wc = wcTimers.get(child);
		if (wc !== undefined) {
			clearTimeout(wc);
			wcTimers.delete(child);
		}
	}

	/** Cancel ALL pending timers, rAFs, and will-change cleanups */
	function cancelAll(): void {
		delayTimers.forEach((t) => clearTimeout(t));
		delayTimers.clear();

		rafHandles.forEach((id) => cancelAnimationFrame(id));
		rafHandles.clear();

		wcTimers.forEach((t) => clearTimeout(t));
		wcTimers.clear();

		if (setupRaf !== null) {
			cancelAnimationFrame(setupRaf);
			setupRaf = null;
		}
	}

	// ── Transition Readiness ─────────────────────────────────────

	/**
	 * Guarantee that CSS transitions are committed before any show animation.
	 *
	 * Problem: If the parent is already in-viewport on mount, the
	 * IntersectionObserver fires its callback before the setup double-rAF
	 * has had time to enable transitions. Without this guard, children
	 * would jump to visible without any animation.
	 *
	 * Solution: Force a synchronous reflow via `offsetHeight` read,
	 * which commits the pending hidden styles. Then safely apply
	 * transitions knowing the browser has already painted the hidden state.
	 */
	function ensureTransitions(): void {
		if (transitionsReady) return;

		// Abort the pending setup double-rAF
		if (setupRaf !== null) {
			cancelAnimationFrame(setupRaf);
			setupRaf = null;
		}

		// Force reflow — commits hidden styles to the rendering pipeline
		void node.offsetHeight;

		// Now safe to add transitions
		children.forEach((child) => {
			const childConfig = getChildConfig(child);
			child.style.transition = buildTransition(childConfig.duration, childConfig.easing);
		});

		transitionsReady = true;
	}

	// ── Observer ─────────────────────────────────────────────────

	/**
	 * Create and start the single IntersectionObserver for this parent.
	 *
	 * The observer watches the parent container (not individual children)
	 * and triggers batch show/hide operations on all children.
	 *
	 * Behaviour matrix:
	 *   once=true  → animate once, then unobserve (best performance)
	 *   mirror=true  → re-hide children when parent scrolls out
	 *   mirror=false → children stay visible after first reveal
	 */
	function startObserver(): void {
		observer = new IntersectionObserver(
			([entry]) => {
				if (!entry) return;

				if (entry.isIntersecting) {
					// Skip if already showing
					if (isVisible) return;
					isVisible = true;

					// Cancel any in-flight hide animations
					cancelAll();

					// Trigger staggered reveal
					showAll();

					// In once mode, disconnect observer for performance
					if (config.once) {
						observer?.unobserve(node);
					}
				} else {
					// once mode: never re-hide
					if (config.once) return;

					// mirror=false: stay visible after reveal
					if (!config.mirror) return;

					isVisible = false;

					// Cancel any in-flight show animations
					cancelAll();

					// Re-hide all children with transition
					hideAll();
				}
			},
			{
				threshold: config.threshold,
				rootMargin: `0px 0px -${config.offset}px 0px`
			}
		);

		observer.observe(node);
	}

	// ── Lifecycle ────────────────────────────────────────────────

	/**
	 * Full initialisation sequence:
	 *   1. Discover children via selector
	 *   2. Instantly hide all children (no transition)
	 *   3. Enable CSS transitions after browser paints hidden state
	 *   4. Start IntersectionObserver on the parent
	 */
	function init(): void {
		children = Array.from(node.querySelectorAll<HTMLElement>(config.selector));

		if (children.length === 0) return;

		transitionsReady = false;

		// Step 1: Instantly hide all children WITHOUT transition
		children.forEach((child) => {
			child.style.transition = 'none';
			setChildHidden(child);
		});

		// Step 2: Enable transitions after browser paints hidden state.
		//         Double-rAF guarantees at least one full paint cycle
		//         between hiding and enabling transitions.
		setupRaf = requestAnimationFrame(() => {
			setupRaf = requestAnimationFrame(() => {
				setupRaf = null;
				children.forEach((child) => {
					const childConfig = getChildConfig(child);
					child.style.transition = buildTransition(childConfig.duration, childConfig.easing);
				});
				transitionsReady = true;
			});
		});

		// Step 3: Start observing the parent container
		startObserver();
	}

	/** Tear down observer and cancel all pending async work */
	function teardown(): void {
		cancelAll();
		observer?.disconnect();
		observer = null;
	}

	/** Strip all reveal-injected inline styles from children */
	function cleanStyles(): void {
		children.forEach((child) => removeInlineStyles(child));
	}

	// ── Boot ─────────────────────────────────────────────────────

	init();

	// ── Svelte Action Return ─────────────────────────────────────

	return {
		/**
		 * Called by Svelte when the action's options change reactively.
		 *
		 * Performs a full teardown → clean → reinit cycle to ensure
		 * the new configuration is applied cleanly without artefacts.
		 */
		update(newOptions: RevealOptions): void {
			teardown();
			cleanStyles();
			config = { ...DEFAULTS, ...newOptions };
			isVisible = false;
			init();
		},

		/**
		 * Called by Svelte when the parent element is removed from the DOM.
		 *
		 * Disconnects the IntersectionObserver, cancels all pending timers
		 * and animation frames, and removes injected inline styles.
		 */
		destroy(): void {
			teardown();
			cleanStyles();
		}
	};
}
