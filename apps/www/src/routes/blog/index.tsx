import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { BODY, HEADING, LEAD, PANEL, PANEL_PAD, Page, SMALL, SUBHEAD } from "@/components/citerank/v2/kit";
import { PageHead, PageShell } from "@/components/citerank/v2/shell";
import { authorDisplayName, isAiAuthor } from "@/data/authors";
import { formatPostDate } from "@/lib/format";
import { breadcrumbJsonLd, canonicalUrl, ogMeta, SITE_NAME } from "@/lib/seo";

const title = "Blog · CiteRank.com";
const description = "Learn how to optimize your brand's AI search visibility.";

interface PostMeta {
	url: string;
	title: string;
	description: string;
	date: string;
	author: string;
	tags: string[];
}

const listPosts = createServerFn({ method: "GET" }).handler(async (): Promise<PostMeta[]> => {
	const { blogSource } = await import("@/lib/blog");
	return blogSource
		.getPages()
		.map((page) => ({
			url: page.url,
			title: page.data.title,
			description: page.data.description ?? "",
			date: page.data.date,
			author: page.data.author,
			tags: page.data.tags ?? [],
		}))
		.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
});

export const Route = createFileRoute("/blog/")({
	head: () => ({
		meta: [
			{ title },
			{ name: "description", content: description },
			...ogMeta({ title, description, path: "/blog", label: "Blog" }),
		],
		links: [
			{ rel: "canonical", href: canonicalUrl("/blog") },
			{
				rel: "alternate",
				type: "application/rss+xml",
				title: `${SITE_NAME} Blog`,
				href: canonicalUrl("/blog/rss.xml"),
			},
		],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "Blog", path: "/blog" },
			]),
		],
	}),
	loader: async () => ({ posts: await listPosts() }),
	component: ResourcesPage,
});

const POST_LINK =
	"rounded-sm transition-colors duration-200 after:absolute after:inset-0 group-hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

function PostFacts({ post, className }: { post: PostMeta; className: string }) {
	return (
		<p className={`${SMALL} flex flex-wrap gap-x-4 text-zinc-600 ${className}`}>
			<time dateTime={post.date} className="whitespace-nowrap">
				{formatPostDate(post.date)}
			</time>
			{!isAiAuthor(post.author) && <span className="whitespace-nowrap">{authorDisplayName(post.author)}</span>}
		</p>
	);
}

/* One list. The newest post leads it at the section size; the rest are an index, a ruled row each, with the date in its own column. */
function ResourcesPage() {
	const { posts } = Route.useLoaderData();

	return (
		<PageShell>
			<PageHead title="Blog" lede="How to get your brand named and cited in AI answers." />

			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page>
					{posts.length === 0 ? (
						<p className={`${BODY} text-zinc-600`}>No posts yet. Check back soon.</p>
					) : (
						<>
							<h2 className="sr-only">All posts</h2>
							<ul className="border-b border-zinc-200">
								{posts.map((post, index) =>
									index === 0 ? (
										<li key={post.url} className="group relative pb-10 lg:pb-16">
											<h3 className={`${HEADING} max-w-[24ch] text-ink`}>
												<a href={post.url} className={POST_LINK}>
													{post.title}
												</a>
											</h3>
											{post.description && (
												<p className={`${LEAD} mt-5 max-w-[60ch] text-zinc-600`}>{post.description}</p>
											)}
											<PostFacts post={post} className="mt-5" />
										</li>
									) : (
										<li
											key={post.url}
											className="group relative grid gap-2 border-t border-zinc-200 py-6 lg:grid-cols-12 lg:gap-8 lg:py-8"
										>
											<h3 className={`${SUBHEAD} text-ink lg:col-span-5`}>
												<a href={post.url} className={POST_LINK}>
													{post.title}
												</a>
											</h3>
											{post.description && <p className={`${BODY} text-zinc-600 lg:col-span-5`}>{post.description}</p>}
											<PostFacts post={post} className="lg:col-span-2 lg:col-start-11 lg:flex-col" />
										</li>
									),
								)}
							</ul>
						</>
					)}
				</Page>
			</section>
		</PageShell>
	);
}
