import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { BODY, PANEL, Page, SMALL, SUBHEAD } from "@/components/citerank/v2/kit";
import { PageHead, PageShell } from "@/components/citerank/v2/shell";
import { formatPostDate } from "@/lib/format";
import type { LegalPageSummary } from "@/lib/legal";
import { breadcrumbJsonLd, canonicalUrl, ogMeta } from "@/lib/seo";

const title = "Legal · CiteRank.com";
const description =
	"CiteRank.com's terms of service, privacy policy, cookie policy, subprocessor list, and acceptable use policy, with the date each was updated.";

const getLegalPages = createServerFn({ method: "GET" }).handler(async (): Promise<LegalPageSummary[]> => {
	const { listLegalPages } = await import("@/lib/legal");
	return listLegalPages();
});

export const Route = createFileRoute("/legal/")({
	head: () => ({
		meta: [{ title }, { name: "description", content: description }, ...ogMeta({ title, description, path: "/legal" })],
		links: [{ rel: "canonical", href: canonicalUrl("/legal") }],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "Legal", path: "/legal" },
			]),
		],
	}),
	loader: async () => ({ pages: await getLegalPages() }),
	component: LegalIndex,
});

function LegalIndex() {
	const { pages } = Route.useLoaderData();

	return (
		<PageShell>
			<PageHead
				title="The fine print, in public"
				lede="These policies cover the CiteRank.com tracker, the AI search agency, and our websites. CiteRank.com is a trading name of Danx Digital Limited."
			/>

			{/* The first rule opens the list, so the section brings less padding than usual to keep the usual gap to the first title. */}
			<section className={`${PANEL} pt-3 pb-9 sm:pt-6 sm:pb-12 lg:pt-10 lg:pb-18`}>
				<Page>
					<dl className="border-b border-zinc-200">
						{pages.map((page) => (
							<div
								key={page.slug}
								className="group relative grid gap-2 border-t border-zinc-200 py-6 lg:grid-cols-12 lg:gap-8 lg:py-8"
							>
								<dt className={`${SUBHEAD} text-ink lg:col-span-5`}>
									<a
										href={`/legal/${page.slug}`}
										className="rounded-sm transition-colors duration-200 after:absolute after:inset-0 group-hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust"
									>
										{page.title}
									</a>
								</dt>
								<dd className={`${BODY} text-zinc-600 lg:col-span-4`}>{page.description}</dd>
								<dd className={`${SMALL} whitespace-nowrap text-zinc-600 lg:col-span-3 lg:justify-self-end`}>
									Updated <time dateTime={page.updated}>{formatPostDate(page.updated)}</time>
								</dd>
							</div>
						))}
					</dl>
				</Page>
			</section>
		</PageShell>
	);
}
