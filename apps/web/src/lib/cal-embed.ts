// CiteRank.com: the founders' Cal.com calendar, embedded in the app's agency booking.
const CAL_ORIGIN = "https://app.cal.com";
const CAL_EMBED_SCRIPT = `${CAL_ORIGIN}/embed/embed.js`;

/** Hosts the embed loads from, for the Content-Security-Policy. */
export const CAL_EMBED_CSP = CAL_ORIGIN;

type CalCommand = (...args: unknown[]) => void;
type CalQueue = CalCommand & { q: unknown[][]; loaded?: boolean; ns: Record<string, CalCommand> };

declare global {
	interface Window {
		Cal?: CalQueue;
	}
}

interface CalEvent<T> {
	detail: { data: T };
}

let initialised = false;
let bookedHandler: (bookingUid: string) => void = () => {};

// Like Cal.com's own snippet, every command queues until embed.js arrives and replays them.
function cal(...args: unknown[]): void {
	if (!window.Cal) {
		const queue = ((...queued: unknown[]) => {
			queue.q.push(queued);
		}) as CalQueue;
		queue.q = [];
		queue.ns = {};
		window.Cal = queue;
	}
	if (!window.Cal.loaded) {
		window.Cal.loaded = true;
		const script = document.createElement("script");
		script.src = CAL_EMBED_SCRIPT;
		script.async = true;
		document.head.appendChild(script);
	}
	window.Cal(...args);
}

/** Draws the calendar into `element`, with `config` filling in the booking form. Safe to call again after the element is gone. */
export function embedInlineBooking({
	element,
	calLink,
	config,
	onBooked,
}: {
	element: HTMLElement;
	calLink: string;
	config?: Record<string, string>;
	onBooked: (bookingUid: string) => void;
}): void {
	bookedHandler = onBooked;
	if (!initialised) {
		initialised = true;
		cal("init", { origin: CAL_ORIGIN });
		const brand = getComputedStyle(document.documentElement).getPropertyValue("--color-rust").trim();
		cal("ui", {
			hideEventTypeDetails: false,
			layout: "month_view",
			theme: "light",
			...(brand ? { cssVarsPerTheme: { light: { "cal-brand": brand } } } : {}),
		});
		cal("on", {
			action: "bookingSuccessfulV2",
			callback: (event: CalEvent<{ uid?: string }>) => {
				const { uid } = event.detail.data;
				if (uid) bookedHandler(uid);
			},
		});
	}
	cal("inline", { elementOrSelector: element, calLink, config: { layout: "month_view", ...config } });
}
