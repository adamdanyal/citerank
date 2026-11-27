import { onAnalyticsConsent } from "@workspace/ui/lib/cookie-consent";
import { afterPageIdle } from "@workspace/ui/lib/idle";

const GA_MEASUREMENT_ID = "G-GFRRHXD97S";

// A test address or a local preview must never count as a visit.
const PRODUCTION_HOSTS = new Set(["citerank.com", "www.citerank.com"]);

const GA_COOKIE = /^_ga($|_)/;

type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

let loaded = false;

function gtag(...args: unknown[]): void {
	(window as GtagWindow).gtag?.(...args);
}

function stub(): void {
	const w = window as GtagWindow;
	w.dataLayer ??= [];
	// gtag.js only recognises commands pushed as `arguments` objects; a plain
	// array is read as a dataLayer message and silently ignored.
	w.gtag ??= function gtag() {
		w.dataLayer?.push(arguments);
	};
}

// The script is fetched only once analytics is allowed, so a visitor who
// declines never downloads it. It queues every command until it arrives, so it
// can wait for the page to settle. Page views after the first come from GA4's
// own tracking of history changes.
function start(): void {
	if (loaded) {
		gtag("consent", "update", { analytics_storage: "granted" });
		return;
	}
	loaded = true;
	stub();
	gtag("consent", "default", {
		analytics_storage: "denied",
		ad_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied",
	});
	gtag("consent", "update", { analytics_storage: "granted" });
	gtag("js", new Date());
	gtag("config", GA_MEASUREMENT_ID);

	void afterPageIdle().then(() => {
		const script = document.createElement("script");
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
		document.head.appendChild(script);
	});
}

function clearCookies(): void {
	const labels = window.location.hostname.split(".");
	const domains = labels.map((_, index) => labels.slice(index).join("."));
	for (const entry of document.cookie.split("; ")) {
		const name = entry.split("=")[0];
		if (!GA_COOKIE.test(name)) continue;
		document.cookie = `${name}=; Max-Age=0; path=/`;
		for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
	}
}

function stop(): void {
	if (!loaded) return;
	gtag("consent", "update", { analytics_storage: "denied" });
	clearCookies();
}

/**
 * Start Google Analytics if the visitor's consent allows it, and keep following
 * that answer for the rest of the session. Returns an unsubscribe.
 */
export function initGoogleAnalytics(consentRequired: boolean): () => void {
	if (!PRODUCTION_HOSTS.has(window.location.hostname)) return () => {};
	return onAnalyticsConsent(consentRequired, (allowed) => {
		if (allowed) start();
		else stop();
	});
}
