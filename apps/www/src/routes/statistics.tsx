import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
	BODY,
	HEADING,
	LEAD,
	LINK,
	PANEL,
	PANEL_PAD,
	PANEL_PAD_WIDE,
	Page,
	PanelHead,
	SMALL,
} from "@/components/citerank/v2/kit";
import { PageHead, PageShell } from "@/components/citerank/v2/shell";
import { CiteRankCta, ROW, ROW_LINK, ROW_TITLE } from "@/components/pillar";
import { GROUP_BLURBS, STAT_GROUPS, type Stat, type StatGroup, stats, supportingPosts } from "@/data/statistics";
import { breadcrumbJsonLd, canonicalUrl, itemListJsonLd, ogMeta } from "@/lib/seo";

const title = "AI Search Statistics: 22 Sourced Findings · CiteRank.com";
const description =
	"Sourced statistics on AI search and AI citations: what share of searches carry an AI Overview, which domains get cited, and which GEO tactics work.";

const lead =
	"Twenty-two figures on how AI answer engines cite, drawn from published studies and AI answer tracking data. Every one links to the working behind it, including the ones that contradict each other.";

interface StatWithPost extends Stat {
	url: string;
	postTitle: string;
}

interface SupportingPost {
	url: string;
	title: string;
	description: string;
	group: StatGroup;
}

const loadStats = createServerFn({ method: "GET" }).handler(
	async (): Promise<{ resolved: StatWithPost[]; supporting: SupportingPost[] }> => {
		const { blogSource } = await import("@/lib/blog");
		const pages = new Map(blogSource.getPages().map((page) => [page.url.replace("/blog/", ""), page]));
		const resolved = stats.flatMap((stat) => {
			const page = pages.get(stat.slug);
			if (!page) return [];
			return [{ ...stat, url: page.url, postTitle: page.data.title }];
		});
		const supporting = supportingPosts.flatMap(({ slug, group }) => {
			const page = pages.get(slug);
			if (!page) return [];
			return [{ url: page.url, title: page.data.title, description: page.data.description ?? "", group }];
		});
		return { resolved, supporting };
	},
);

export const Route = createFileRoute("/statistics")({
	head: ({ loaderData }) => ({
		meta: [
			{ title },
			{ name: "description", content: description },
			...ogMeta({ title, description, path: "/statistics" }),
		],
		links: [{ rel: "canonical", href: canonicalUrl("/statistics") }],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "AI search statistics", path: "/statistics" },
			]),
			itemListJsonLd(
				(loaderData?.resolved ?? []).map((stat) => ({
					name: `${stat.value}: ${stat.claim}`,
					path: `/blog/${stat.slug}`,
				})),
			),
		],
	}),
	loader: async () => await loadStats(),
	component: StatisticsPage,
});

const FIGURE =
	"font-heading text-[clamp(1.75rem,1.5vw+1.15rem,2.5rem)] leading-[1.1] font-bold tracking-[-0.02em] text-rust [overflow-wrap:break-word] min-w-0";
const ROW_GRID = "grid gap-2 py-6 lg:grid-cols-12 lg:gap-8";

function StatisticsPage() {
	const { resolved, supporting } = Route.useLoaderData();
	return (
		<PageShell>
			<PageHead title="AI search statistics" lede={lead} />

			{STAT_GROUPS.map((group) => {
				const inGroup = resolved.filter((stat) => stat.group === group);
				const extras = supporting.filter((post) => post.group === group);
				if (inGroup.length === 0 && extras.length === 0) return null;
				return (
					<section key={group} className={`${PANEL} ${PANEL_PAD}`}>
						<Page>
							<PanelHead title={group}>
								<p className={`${LEAD} text-zinc-600`}>{GROUP_BLURBS[group]}</p>
							</PanelHead>
							<ul className="mt-10 border-b border-zinc-200 lg:mt-16">
								{inGroup.map((stat) => (
									<li key={stat.slug} className={`${ROW} ${ROW_GRID}`}>
										<p className={`${FIGURE} lg:col-span-4`}>{stat.value}</p>
										<div className="min-w-0 max-w-[64ch] lg:col-span-8">
											<p className={`${BODY} text-ink`}>{stat.claim}</p>
											<p className={`${SMALL} mt-2 text-zinc-600`}>
												Source: {stat.source}.{" "}
												<a href={stat.url} className={`${LINK} text-zinc-700 hover:text-ink`}>
													{stat.postTitle}
												</a>
											</p>
										</div>
									</li>
								))}
								{extras.map((post) => (
									<li key={post.url} className={ROW}>
										<a href={post.url} className={`${ROW_LINK} ${ROW_GRID}`}>
											<span className={`${ROW_TITLE} block lg:col-span-4`}>{post.title}</span>
											<span className={`${BODY} block max-w-[64ch] text-zinc-600 lg:col-span-8`}>
												{post.description}
											</span>
										</a>
									</li>
								))}
							</ul>
						</Page>
					</section>
				);
			})}

			<section className={`${PANEL} ${PANEL_PAD_WIDE}`}>
				<Page className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
					<p className={`${HEADING} text-ink lg:col-span-7`}>
						Most numbers quoted about AI search come without a denominator. These do.
					</p>
					<div className={`${BODY} space-y-4 text-zinc-600 lg:col-span-5`}>
						<p>
							Each figure names its source and links to the piece that works through how it was measured and where it
							disagrees with the next study.
						</p>
						<p>Free to cite, with attribution to the original source rather than to us where the two differ.</p>
					</div>
				</Page>
			</section>

			<CiteRankCta />
		</PageShell>
	);
}
