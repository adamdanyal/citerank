import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ArrowUpRight } from "lucide-react";
import { DirectoryHero } from "@/components/directory-shell";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { CiteRankCta } from "@/components/pillar";
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

function StatisticsPage() {
	const { resolved, supporting } = Route.useLoaderData();
	return (
		<div className="min-h-screen bg-white antialiased">
			<Navbar />
			<main>
				<DirectoryHero title="AI search statistics" lead={lead} />

				<section className="bg-white py-16 lg:py-20">
					<div className="mx-auto max-w-6xl px-4 md:px-6">
						<div className="max-w-3xl space-y-5">
							<p className="body-7 text-zinc-700">
								Most numbers quoted about AI search come without a denominator. These do. Each figure names its source
								and links to the piece that works through how it was measured and where it disagrees with the next
								study.
							</p>
							<p className="body-7 text-zinc-700">
								Free to cite, with attribution to the original source rather than to us where the two differ.
							</p>
						</div>

						{STAT_GROUPS.map((group) => {
							const inGroup = resolved.filter((stat) => stat.group === group);
							const extras = supporting.filter((post) => post.group === group);
							if (inGroup.length === 0 && extras.length === 0) return null;
							return (
								<div key={group} className="mt-16">
									<h2 className="heading-4 text-zinc-950">{group}</h2>
									<p className="body-6 mt-3 max-w-3xl text-zinc-600">{GROUP_BLURBS[group]}</p>
									<ul className="mt-8 divide-y divide-zinc-200 border-zinc-200 border-t">
										{inGroup.map((stat) => (
											<li key={stat.slug} className="py-5">
												<div className="flex flex-col gap-1.5 sm:flex-row sm:gap-6">
													<span className="heading-5 shrink-0 text-blue-700 tabular-nums sm:w-44">{stat.value}</span>
													<div className="max-w-3xl">
														<p className="body-1 text-zinc-700">{stat.claim}</p>
														<p className="caption-2 mt-1.5 text-zinc-500">
															{stat.source}.{" "}
															<a
																href={stat.url}
																className="group inline-flex items-center gap-1 underline underline-offset-2 hover:text-zinc-900"
															>
																{stat.postTitle}
																<ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5" />
															</a>
														</p>
													</div>
												</div>
											</li>
										))}
										{extras.map((post) => (
											<li key={post.url} className="py-5">
												<a href={post.url} className="group flex flex-col gap-1">
													<span className="title-3 flex items-start gap-1.5 text-zinc-950">
														{post.title}
														<ArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform group-hover:-translate-y-0.5" />
													</span>
													<span className="body-6 max-w-3xl text-zinc-600">{post.description}</span>
												</a>
											</li>
										))}
									</ul>
								</div>
							);
						})}
					</div>
				</section>

				<CiteRankCta />
			</main>
			<Footer />
		</div>
	);
}
