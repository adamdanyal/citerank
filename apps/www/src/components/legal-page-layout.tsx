// Mirrors blog-post-layout.tsx: the heavy fumadocs-ui / browser-collection
// imports live here, NOT in the route file, so @tanstack/router-plugin can
// split them into the legal chunk instead of shipping them everywhere.

import browserCollections from "collections/browser";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import { Suspense } from "react";
import { BODY, LINK, Page, SMALL } from "@/components/citerank/v2/kit";
import { PageShell } from "@/components/citerank/v2/shell";
import { DOC_BODY, DOC_GRID, DOC_TEXT, DocumentHead, getDocumentComponents } from "@/components/mdx";
import { formatPostDate } from "@/lib/format";
import type { LegalPageSummary } from "@/lib/legal";
import type { LegalLoaderData } from "@/routes/legal/$";

const mdxComponents = getDocumentComponents();

export const clientLoader = browserCollections.legal.createClientLoader({
	component({ default: MDX }, _props: undefined) {
		return <MDX components={mdxComponents} />;
	},
});

/* Beside the document on a wide screen, where it stays in reach; under it on a phone. */
function SiblingPolicies({ pages, currentSlug }: { pages: LegalPageSummary[]; currentSlug: string }) {
	const others = pages.filter((page) => page.slug !== currentSlug);
	if (others.length === 0) return null;

	return (
		<nav
			aria-label="Other policies"
			className="border-t border-zinc-200 pt-8 lg:sticky lg:top-28 lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:self-start lg:border-t-0 lg:pt-0"
		>
			<h2 className={`${SMALL} font-sans font-normal tracking-normal text-zinc-600`}>Other policies</h2>
			<ul className="mt-3 space-y-1">
				{others.map((page) => (
					<li key={page.slug}>
						<a
							href={`/legal/${page.slug}`}
							className={`${LINK} ${BODY} inline-block py-1 font-medium whitespace-nowrap text-ink`}
						>
							{page.title}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}

export function LegalPageLayout({ data }: { data: LegalLoaderData }) {
	return (
		<RootProvider theme={{ defaultTheme: "light", forcedTheme: "light" }} search={{ enabled: false }}>
			<PageShell>
				<article>
					<DocumentHead back={{ href: "/legal", label: "Legal" }} title={data.title}>
						<p className={`${BODY} mt-6 text-zinc-600`}>
							Last updated <time dateTime={data.updated}>{formatPostDate(data.updated)}</time>
						</p>
					</DocumentHead>
					<section className={DOC_BODY}>
						<Page className={DOC_GRID}>
							<div className={`${DOC_TEXT} lg:col-span-9 lg:col-start-4 lg:row-start-1`}>
								<Suspense>{clientLoader.useContent(data.path)}</Suspense>
							</div>
							<SiblingPolicies pages={data.pages} currentSlug={data.slugs.join("/")} />
						</Page>
					</section>
				</article>
			</PageShell>
		</RootProvider>
	);
}
