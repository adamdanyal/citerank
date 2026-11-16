import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { cloudSignupUrl } from "@workspace/config/referrals";
import { Closing } from "@/components/citerank/v2/closing";
import {
	ACTION,
	BODY,
	CARD,
	HEADING,
	LEAD,
	LIST_CARD,
	PANEL,
	PANEL_PAD,
	Page,
	SMALL,
	SUBHEAD,
} from "@/components/citerank/v2/kit";
import { PageHead, PageShell } from "@/components/citerank/v2/shell";
import { ITEM_TITLE } from "@/components/pillar";
import { authorDisplayName, isAiAuthor } from "@/data/authors";
import { formatPostDate } from "@/lib/format";
import { trackEvent } from "@/lib/posthog";
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

function PostRow({ post, lead }: { post: PostMeta; lead: boolean }) {
	if (lead) {
		return (
			<li className="group relative pt-8 pb-10 lg:pt-12 lg:pb-14">
				<h3 className={`${HEADING} max-w-[24ch] text-ink`}>
					<a href={post.url} className={POST_LINK}>
						{post.title}
					</a>
				</h3>
				{post.description && <p className={`${LEAD} mt-5 max-w-[60ch] text-zinc-600`}>{post.description}</p>}
				<PostFacts post={post} className="mt-5" />
			</li>
		);
	}
	return (
		<li className="group relative grid gap-2 border-t border-zinc-200 py-6 lg:grid-cols-12 lg:gap-8 lg:py-8">
			<h3 className={`${ITEM_TITLE} text-ink lg:col-span-5`}>
				<a href={post.url} className={POST_LINK}>
					{post.title}
				</a>
			</h3>
			{post.description && (
				<p className={`${BODY} line-clamp-1 self-start text-zinc-600 lg:col-span-5`}>{post.description}</p>
			)}
			<PostFacts post={post} className="lg:col-span-2 lg:col-start-11 lg:flex-col" />
		</li>
	);
}

const FIRST_ROWS = 5;

function StartTracking() {
	return (
		<div
			className={`${CARD} my-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between lg:my-10`}
		>
			<p className={`${SUBHEAD} text-ink`}>See how often AI names your brand</p>
			<a
				href={cloudSignupUrl("marketing-cta")}
				onClick={() => trackEvent("signup_click", { from: "blog-index" })}
				className={ACTION}
			>
				Start tracking
			</a>
		</div>
	);
}

/* One list. The newest post leads it at the section size; the rest are an index, a ruled row each, with the date in its own column. */
function ResourcesPage() {
	const { posts } = Route.useLoaderData();
	const first = posts.slice(0, FIRST_ROWS);
	const rest = posts.slice(FIRST_ROWS);

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
							<ul className={LIST_CARD}>
								{first.map((post, index) => (
									<PostRow key={post.url} post={post} lead={index === 0} />
								))}
							</ul>
							<StartTracking />
							{rest.length > 0 && (
								<ul className={LIST_CARD}>
									{rest.map((post) => (
										<PostRow key={post.url} post={post} lead={false} />
									))}
								</ul>
							)}
						</>
					)}
				</Page>
			</section>
			<Closing from="marketing-page-cta" />
		</PageShell>
	);
}
