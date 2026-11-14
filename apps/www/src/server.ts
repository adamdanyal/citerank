import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { demoSiteUrl } from "@workspace/config/referrals";
import { AD_TAG_CSP } from "@workspace/ui/lib/ad-tags";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";
import { CAL_EMBED_CSP } from "@/lib/cal-embed";

// The live demo opens in a frame on these pages.
const DEMO_ORIGIN = new URL(demoSiteUrl("marketing-demo-frame")).origin;

const SECURITY_HEADERS: Record<string, string> = {
	"Content-Security-Policy": [
		"default-src 'self'",
		`script-src 'self' 'unsafe-inline' https://*.posthog.com https://*.crisp.chat ${CAL_EMBED_CSP} ${AD_TAG_CSP.script}`,
		`style-src 'self' 'unsafe-inline' https://*.crisp.chat ${AD_TAG_CSP.style}`,
		"img-src 'self' data: https:",
		`font-src 'self' data: https://*.crisp.chat ${AD_TAG_CSP.font}`,
		`connect-src 'self' https://*.posthog.com https://*.mux.com https://*.litix.io https://*.crisp.chat wss://*.relay.crisp.chat wss://*.relay.rescue.crisp.chat ${AD_TAG_CSP.connect}`,
		"media-src 'self' blob: https://*.mux.com https://*.crisp.chat",
		"worker-src 'self' blob: https://*.crisp.chat",
		// YouTube embeds in blog posts (privacy-enhanced youtube-nocookie host).
		`frame-src 'self' ${DEMO_ORIGIN} https://www.youtube-nocookie.com https://www.youtube.com https://*.crisp.chat ${CAL_EMBED_CSP} ${AD_TAG_CSP.frame}`,
		"object-src 'none'",
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'",
	].join("; "),
	"X-Frame-Options": "DENY",
	"X-Content-Type-Options": "nosniff",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
};

function addSecurityHeaders(response: Response): Response {
	for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
		response.headers.set(key, value);
	}
	return response;
}

const COMPRESSIBLE =
	/^(text\/|application\/(json|ld\+json|linkset\+json|manifest\+json|xml|rss\+xml|atom\+xml|javascript)|image\/svg\+xml)/;

/*
 * The Node server sends a rendered page as it is, about four times the bytes it
 * needs to be. A proxy in front may compress it, but nothing guarantees one is
 * there. Static files are not touched here: the build writes theirs compressed.
 */
function compress(request: Request, response: Response): Response {
	if (!response.body || response.status !== 200 || request.method !== "GET") return response;
	if (response.headers.has("Content-Encoding")) return response;
	if (!COMPRESSIBLE.test(response.headers.get("Content-Type") ?? "")) return response;
	if (!/\bgzip\b/.test(request.headers.get("Accept-Encoding") ?? "")) return response;

	const headers = new Headers(response.headers);
	headers.set("Content-Encoding", "gzip");
	headers.delete("Content-Length");
	headers.append("Vary", "Accept-Encoding");
	const body = response.body.pipeThrough(new CompressionStream("gzip") as ReadableWritablePair<Uint8Array, Uint8Array>);
	return new Response(body, { status: response.status, statusText: response.statusText, headers });
}

const ENTRY_SCRIPT = /<script\b(?=[^>]*\btype="module")(?=[^>]*\bsrc="(\/assets\/[^"]+\.js)")[^>]*><\/script>/;
const MODULE_PRELOAD = /<link rel="modulepreload"/g;
// Longer than any tag rewritten below, so one split across two chunks is still seen whole.
const HOLD_BACK = 512;

/* Starts the entry module once the browser reports its first contentful paint, or after three seconds in a tab that never paints. */
function deferredEntry(src: string): string {
	return `<script>(function(){var d=0;function go(){if(d)return;d=1;document.querySelectorAll('link[rel="x-modulepreload"]').forEach(function(l){l.rel="modulepreload"});var s=document.createElement("script");s.type="module";s.src=${JSON.stringify(src)};document.head.appendChild(s)}try{new PerformanceObserver(function(l,o){if(l.getEntriesByName("first-contentful-paint").length){o.disconnect();setTimeout(go,0)}}).observe({type:"paint",buffered:true})}catch(e){requestAnimationFrame(function(){setTimeout(go,0)})}setTimeout(go,3000)})();</script>`;
}

/*
 * A page is complete without its scripts, so they wait for the first paint.
 * Left alone, the entry module and the thirty chunks it preloads download beside
 * the stylesheet and the hero image, and on a slow connection they hold both
 * back. The preloads are parked under another rel and restored by the same
 * inline script that adds the entry, so nothing is fetched twice or in a chain.
 * If the build ever stops emitting the tag this looks for, the page is served
 * as it is.
 */
function deferScripts(request: Request, response: Response): Response {
	if (!response.body || response.status !== 200 || request.method !== "GET") return response;
	if (!(response.headers.get("Content-Type") ?? "").startsWith("text/html")) return response;

	const decoder = new TextDecoder();
	const encoder = new TextEncoder();
	let pending = "";
	let entryDone = false;
	const rewrite = (html: string) => {
		let out = html.replace(MODULE_PRELOAD, '<link rel="x-modulepreload"');
		if (!entryDone) {
			out = out.replace(ENTRY_SCRIPT, (_tag, src: string) => {
				entryDone = true;
				return deferredEntry(src);
			});
		}
		return out;
	};
	const body = response.body.pipeThrough(
		new TransformStream<Uint8Array, Uint8Array>({
			transform(chunk, controller) {
				pending += decoder.decode(chunk, { stream: true });
				if (pending.length <= HOLD_BACK) return;
				// Cut only at a tag start, so no tag is ever split between what is sent and what is kept.
				const cut = pending.lastIndexOf("<", pending.length - HOLD_BACK);
				if (cut <= 0) return;
				controller.enqueue(encoder.encode(rewrite(pending.slice(0, cut))));
				pending = pending.slice(cut);
			},
			flush(controller) {
				pending += decoder.decode();
				if (pending) controller.enqueue(encoder.encode(rewrite(pending)));
			},
		}),
	);
	const headers = new Headers(response.headers);
	headers.delete("Content-Length");
	return new Response(body, { status: response.status, statusText: response.statusText, headers });
}

const DISCOVERY_LINKS = [
	`</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"`,
	`</.well-known/ard.json>; rel="ard"`,
	`</api/openapi.json>; rel="service-desc"`,
	`</docs>; rel="service-doc"; type="text/html"`,
	`</llms.txt>; rel="describedby"; type="text/plain"`,
	`</sitemap.xml>; rel="sitemap"; type="application/xml"`,
].join(", ");

function isDiscoverable(response: Response): boolean {
	const type = response.headers.get("Content-Type") ?? "";
	return type.startsWith("text/html") || type.startsWith("text/markdown");
}

function addDiscoveryLinks(response: Response, markdownAlternate?: string): void {
	if (!isDiscoverable(response)) return;
	const links = markdownAlternate
		? `${DISCOVERY_LINKS}, <${markdownAlternate}>; rel="alternate"; type="text/markdown"`
		: DISCOVERY_LINKS;
	response.headers.set("Link", links);
}

const MARKDOWN_SOURCES = [
	{ base: "/docs", indexIsPage: true },
	{ base: "/blog", indexIsPage: false },
].map(({ base, indexIsPage }) => ({
	base,
	indexIsPage,
	stripMd: rewritePath(`${base}{/*path}.md`, `/llms.mdx${base}{/*path}`).rewrite,
	stripMdx: rewritePath(`${base}{/*path}.mdx`, `/llms.mdx${base}{/*path}`).rewrite,
	toMarkdown: rewritePath(`${base}{/*path}`, `/llms.mdx${base}{/*path}`).rewrite,
}));

function suffixedMarkdownRoute(path: string): string | undefined {
	for (const source of MARKDOWN_SOURCES) {
		const target = source.stripMd(path) || source.stripMdx(path);
		if (target) return target;
	}
}

function negotiableMarkdownRoute(path: string): string | undefined {
	for (const { base, indexIsPage, toMarkdown } of MARKDOWN_SOURCES) {
		if (path === base && !indexIsPage) continue;
		if (path !== base && !path.startsWith(`${base}/`)) continue;
		const target = toMarkdown(path);
		if (target) return target;
	}
}

function withAcceptHtml(request: Request): Request {
	const headers = new Headers(request.headers);
	headers.set("Accept", "text/html");
	return new Request(request.url, { method: request.method, headers, signal: request.signal });
}

// Keep permanent redirects server-side so backlinks and ranking signals reach
// the canonical replacement rather than a client-rendered not-found page.
const PERMANENT_REDIRECTS: Record<string, string> = {
	"/blog/aeo-agent-skill": "/blog/aeo-skill",
	"/blog/ai-search-engines": "/blog/best-ai-search-engine",
	"/blog/ai-search-glossary": "/glossary",
	"/blog/answer-engine-optimization": "/answer-engine-optimization",
	"/blog/best-open-source-aeo-tools": "/ai-visibility-tools",
	"/blog/generative-ai-for-marketing": "/blog/ai-for-seo",
	"/blog/generative-ai-seo": "/generative-engine-optimization",
	"/blog/generative-engine-optimization": "/generative-engine-optimization",
	"/blog/geo-vs-seo": "/blog/aeo-vs-seo",
	"/blog/google-ai-overviews": "/ai-search/google-ai-overviews",
	"/blog/how-long-does-it-take-to-get-cited-by-ai": "/blog/how-long-to-get-cited-by-ai",
	"/blog/how-to-appear-in-chatgpt": "/ai-search/chatgpt",
	"/blog/how-to-appear-in-google-gemini": "/ai-search/gemini",
	"/blog/how-to-rank-in-perplexity": "/ai-search/perplexity",
	"/blog/iab-ai-visibility-framework": "/blog/iab-ai-visibility-metrics",
	"/blog/llm-optimization": "/glossary/llmo",
	"/blog/llm-seo": "/glossary/llmo",
	"/blog/track-brand-ai-search": "/answer-engine-optimization",
	"/blog/what-is-generative-seo": "/generative-engine-optimization",
	"/docs/mcp": "/docs/api/mcp",
	// The URLs people (and ad platforms, and app stores) guess for these.
	"/terms": "/legal/terms",
	"/privacy": "/legal/privacy",
	"/cookies": "/legal/cookies",
	"/subprocessors": "/legal/subprocessors",
	"/acceptable-use": "/legal/acceptable-use",
};
export default createServerEntry({
	async fetch(request) {
		const url = new URL(request.url);
		const path = url.pathname;

		const movedTo = PERMANENT_REDIRECTS[path.replace(/\/+$/, "") || "/"];
		if (movedTo) {
			return addSecurityHeaders(new Response(null, { status: 308, headers: { Location: `${movedTo}${url.search}` } }));
		}

		// An explicit .md / .mdx suffix always serves markdown, ignoring Accept.
		let target = suffixedMarkdownRoute(path);

		const negotiable = target ? undefined : negotiableMarkdownRoute(path);
		const wantsMarkdown = !target && isMarkdownPreferred(request);
		if (negotiable && wantsMarkdown) target = negotiable;

		let req = request;
		if (target) {
			url.pathname = target;
			req = new Request(url, request);
		} else if (wantsMarkdown && (request.method === "GET" || request.method === "HEAD")) {
			req = withAcceptHtml(request);
		}

		const response = await handler.fetch(req);
		if (negotiable) response.headers.set("Vary", "Accept");
		addDiscoveryLinks(response, negotiable ? `${path}.md` : undefined);
		return compress(request, deferScripts(request, addSecurityHeaders(response)));
	},
});
