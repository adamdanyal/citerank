/* Either name for this machine, so the marketing site reaches the demo however it is opened locally. */
const LOOPBACK_TWIN: Record<string, string> = { localhost: "127.0.0.1", "127.0.0.1": "localhost" };

/**
 * The origins allowed to show this app inside a frame. None, with one
 * exception: the demo, which the marketing site opens inside its own pages. It
 * may be framed by that site, under the bare domain or www, and by nothing else.
 */
export function frameAncestors(mode: string | undefined, marketingSiteUrl: string): string[] {
	if (mode !== "demo") return [];

	const site = new URL(marketingSiteUrl);
	const { hostname } = site;
	const twin = new URL(site.origin);
	twin.hostname =
		LOOPBACK_TWIN[hostname] ?? (hostname.startsWith("www.") ? hostname.slice("www.".length) : `www.${hostname}`);
	return [site.origin, twin.origin];
}
