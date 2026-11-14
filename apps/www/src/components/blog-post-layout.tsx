// Mirrors docs-page-layout.tsx: the heavy fumadocs-ui / browser-collection
// imports live here, NOT in the route file. routes/blog/$.tsx only
// references BlogPostLayout from inside the route's `component:`, which
// @tanstack/router-plugin auto-splits into its own chunk, keeping these deps
// out of the bundle that loads on other marketing pages.

import browserCollections from "collections/browser";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import type { ComponentPropsWithoutRef } from "react";
import { Suspense } from "react";
import { AuthorByline } from "@/components/author-byline";
import { LEAD, Page } from "@/components/citerank/v2/kit";
import { PageShell } from "@/components/citerank/v2/shell";
import { DOC_BODY, DOC_GRID, DOC_H2, DOC_H3, DOC_TEXT, DocumentHead, getDocumentComponents } from "@/components/mdx";
import type { BlogPostFaqItem, BlogPostLoaderData } from "@/routes/blog/$";

function isElmoHref(href: string): boolean {
	if (href.startsWith("/") || href.startsWith("#")) return true;
	try {
		const { hostname } = new URL(href);
		return hostname === "citerank.com" || hostname.endsWith(".citerank.com");
	} catch {
		// mailto:, tel:, or other non-http(s) hrefs — not an outbound web link.
		return true;
	}
}

// Outbound hosts we intentionally pass SEO equity to (dofollow), e.g. partners
// we've agreed to link to. An explicit allowlist keeps the default nofollow.
// Empty until CiteRank.com has partners of its own; the hosts this shipped with were Elmo's.
const DOFOLLOW_HOSTS: string[] = [];

function isDofollowHref(href: string): boolean {
	try {
		const { hostname } = new URL(href);
		return DOFOLLOW_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));
	} catch {
		return false;
	}
}

// Links inside post content: outbound links are nofollow and open in a new
// tab, so blog posts don't pass SEO equity to external sites (e.g. competitors
// we reference). Internal / elmohq-owned links stay followed; noopener keeps
// the referrer for analytics on owned domains. Hosts in DOFOLLOW_HOSTS are the
// exception — followed outbound links for agreed partners.
function BlogLink({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
	if (isElmoHref(href)) {
		const rel = /^https?:\/\//.test(href) ? "noopener" : undefined;
		return <a {...props} href={href} rel={rel} />;
	}
	const rel = isDofollowHref(href) ? "noopener noreferrer" : "nofollow noopener noreferrer";
	return <a {...props} href={href} target="_blank" rel={rel} />;
}

// getDocumentComponents is a plain factory (no React hooks), so the components
// map is built once at module scope rather than per render.
const mdxComponents = getDocumentComponents({ a: BlogLink });

const clientLoader = browserCollections.blog.createClientLoader({
	component({ default: MDX }, _props: undefined) {
		return <MDX components={mdxComponents} />;
	},
});

// Rendered from frontmatter `faq` so the visible Q&A and the FAQPage JSON-LD
// (emitted in routes/blog/$.tsx) come from one source. Questions are h3s so
// they nest under the post's h2 outline.
function PostFaq({ items }: { items: BlogPostFaqItem[] }) {
	return (
		<section>
			<h2 id="faq" className={DOC_H2}>
				Frequently asked questions
			</h2>
			{items.map((item) => (
				<div key={item.question}>
					<h3 className={DOC_H3}>{item.question}</h3>
					<p>{item.answer}</p>
				</div>
			))}
		</section>
	);
}

export function BlogPostLayout({ data }: { data: BlogPostLoaderData }) {
	return (
		<RootProvider theme={{ defaultTheme: "light", forcedTheme: "light" }} search={{ enabled: false }}>
			<PageShell>
				<article>
					<DocumentHead back={{ href: "/blog", label: "Blog" }} title={data.title}>
						{data.description && <p className={`${LEAD} mt-6 max-w-[60ch] text-zinc-600`}>{data.description}</p>}
					</DocumentHead>
					<section className={DOC_BODY}>
						<Page className={DOC_GRID}>
							<div className="lg:col-span-3">
								<AuthorByline author={data.author} date={data.date} updated={data.updated} />
							</div>
							<div className={`${DOC_TEXT} lg:col-span-9`}>
								<Suspense>{clientLoader.useContent(data.path)}</Suspense>
								{data.faq && data.faq.length > 0 && <PostFaq items={data.faq} />}
							</div>
						</Page>
					</section>
				</article>
			</PageShell>
		</RootProvider>
	);
}
