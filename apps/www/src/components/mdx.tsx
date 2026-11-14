import { FeedbackBlock } from "@workspace/docs/components/feedback/client";
import type { ActionResponse, BlockFeedback } from "@workspace/docs/components/feedback/schema";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import {
	Children,
	type ComponentProps,
	type CSSProperties,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";
import { DISPLAY_S, LINK, PANEL, Page, SMALL, SUBHEAD } from "@/components/citerank/v2/kit";
import { ProviderCTA } from "@/components/provider-cta";
import { YouTubeEmbed } from "@/components/youtube-embed";

async function onBlockFeedback(feedback: BlockFeedback): Promise<ActionResponse> {
	const { trackEvent } = await import("@/lib/posthog");
	trackEvent("docs_block_feedback", {
		block_id: feedback.blockId,
		block_body: feedback.blockBody || undefined,
		message: feedback.message,
		url: feedback.url,
	});
	return { success: true };
}

function TrackedFeedbackBlock(props: { id: string; body?: string; children: React.ReactNode }) {
	return <FeedbackBlock {...props} onSendAction={onBlockFeedback} />;
}

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		FeedbackBlock: TrackedFeedbackBlock,
		YouTube: YouTubeEmbed,
		ProviderCTA,
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

/*
 * A long document, the blog posts and the policies: a banner head, then the
 * text on nine columns beside a rail on three. The text holds a measure of
 * about 70 characters; a chart or a code sample may run to 45rem and a table
 * to the whole nine columns.
 */
export const DOC_BODY = `${PANEL} pt-7 pb-12 sm:pt-10 sm:pb-15 lg:pt-15 lg:pb-22`;
export const DOC_GRID = "grid gap-10 lg:grid-cols-12 lg:gap-8";

/* A document has a dozen heads, so they take the item title's size and stay close to their text. */
export const DOC_H2 = `${SUBHEAD} group mt-14 mb-4 scroll-mt-6 text-ink`;
export const DOC_H3 =
	"group mt-10 mb-3 scroll-mt-6 font-heading text-[1.25rem] leading-[1.3] font-bold tracking-[-0.01em] text-ink [overflow-wrap:break-word]";
const DOC_H4 = "group mt-8 mb-2 scroll-mt-6 font-heading text-[1rem] leading-[1.4] font-bold text-ink";

export const DOC_TEXT = [
	"min-w-0 text-[1rem] leading-[1.7] text-pretty text-zinc-700 marker:text-zinc-500",
	"[&>*]:max-w-[35rem] [&>figure]:my-8 [&>figure]:max-w-[45rem] [&>:first-child]:mt-0 [&>:last-child]:mb-0",
	"[&_p]:mb-5 [&_li]:my-2 [&_li]:ps-1 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:ps-6 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:ps-5",
	"[&_strong]:font-bold [&_strong]:text-ink [&_hr]:my-12 [&_hr]:border-zinc-200 [&_h2+h3]:mt-6 [&_h2+div>h3]:mt-6",
	"[&_a:not([class])]:rounded-sm [&_a:not([class])]:text-ink [&_a:not([class])]:underline [&_a:not([class])]:decoration-zinc-400 [&_a:not([class])]:underline-offset-4 [&_a:not([class])]:transition-colors [&_a:not([class])]:duration-200",
	"[&_a:not([class]):hover]:decoration-rust [&_a:not([class]):focus-visible]:outline-2 [&_a:not([class]):focus-visible]:outline-offset-2 [&_a:not([class]):focus-visible]:outline-rust",
	"[&_:not(pre)>code]:rounded-sm [&_:not(pre)>code]:bg-paper-2 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.8125rem] [&_:not(pre)>code]:text-ink",
	"[&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-300 [&_blockquote]:ps-5 [&_blockquote]:text-lead [&_blockquote]:leading-[1.45] [&_blockquote]:text-ink",
	"[&_figcaption]:mt-3 [&_figcaption]:text-[0.875rem] [&_figcaption]:leading-[1.5] [&_figcaption]:text-zinc-600",
	/* Tables are ruled, never boxed. */
	"[&_table]:w-full [&_table]:border-separate [&_table]:border-spacing-0 [&_table]:border-t [&_table]:border-zinc-200 [&_table]:text-left [&_table]:text-[0.875rem] [&_table]:leading-[1.5] [&_table]:tabular-nums [&_thead:not(:has(th:not(:empty)))]:hidden",
	"[&_th]:border-b [&_th]:border-zinc-300 [&_th]:py-3 [&_th]:pe-5 [&_th]:align-bottom [&_th]:font-medium [&_th]:text-ink [&_th:last-child]:pe-0",
	"[&_td]:border-b [&_td]:border-zinc-200 [&_td]:py-3 [&_td]:pe-5 [&_td]:align-top [&_td:last-child]:pe-0 [&_td_a]:whitespace-nowrap",
].join(" ");

/**
 * A document's opening: the way back, its title, and the one line under it.
 * The title takes the smaller display size: a post's runs to a dozen words,
 * and a policy's one long word has to fit a 320px screen unbroken.
 */
export function DocumentHead({
	back,
	title,
	children,
}: {
	back: { href: string; label: string };
	title: string;
	children?: ReactNode;
}) {
	return (
		<section className={`${PANEL} pt-10 pb-7 sm:pt-12 sm:pb-10 lg:pt-16 lg:pb-15`}>
			<Page>
				<nav aria-label="Breadcrumb">
					<a
						href={back.href}
						className={`${LINK} ${SMALL} inline-block py-2 font-medium whitespace-nowrap text-zinc-700`}
					>
						{back.label}
					</a>
				</nav>
				<h1 className={`${DISPLAY_S} mt-4 max-w-[26ch] text-ink`}>{title}</h1>
				{children}
			</Page>
		</section>
	);
}

/* The heading is plain text and its link is a mark beside it, so a long head wraps as text and the link never does. */
function heading(Tag: "h2" | "h3" | "h4", className: string) {
	return function DocumentHeading({ id, children, ...props }: ComponentProps<"h2">) {
		return (
			<Tag {...props} id={id} className={className}>
				{children}
				{id ? (
					<a
						href={`#${id}`}
						aria-label="Link to this section"
						className={`ms-2 rounded-sm font-sans font-normal text-zinc-500 no-underline opacity-0 group-hover:opacity-100 hover:text-ink focus-visible:opacity-100 ${FOCUS}`}
					>
						#
					</a>
				) : null}
			</Tag>
		);
	};
}

type Parent = ReactElement<{ children?: ReactNode }>;

function textOf(node: ReactNode): string {
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(textOf).join("");
	return isValidElement<{ children?: ReactNode }>(node) ? textOf(node.props.children) : "";
}

function childrenOf(node: ReactNode, tag: string): Parent[] {
	return Children.toArray(node).filter((child): child is Parent => isValidElement(child) && child.type === tag);
}

/* The head's labels, and the longest row and the longest row name, read from the table MDX hands over. */
function measureTable(children: ReactNode) {
	const head = childrenOf(children, "thead")[0];
	const headRow = head ? childrenOf(head.props.children, "tr")[0] : undefined;
	const labels = headRow ? childrenOf(headRow.props.children, "th").map((cell) => textOf(cell).trim()) : [];
	const rows = childrenOf(children, "tbody").flatMap((body) => childrenOf(body.props.children, "tr"));
	return {
		labels,
		longestRow: Math.max(0, ...rows.map((row) => textOf(row).length)),
		longestName: Math.max(0, ...rows.map((row) => textOf(childrenOf(row.props.children, "td")[0]).length)),
	};
}

/* Under 64rem a table of four columns or more takes the width its content asks for, up to a cap that grows with its columns, and scrolls. */
const TABLE_FRAME =
	"min-w-full max-lg:has-[th:nth-child(4)]:w-max max-lg:has-[th:nth-child(4):last-child]:max-w-[36rem] max-lg:has-[th:nth-child(5):last-child]:max-w-[44rem] max-lg:has-[th:nth-child(6)]:max-w-[52rem]";

/* Under 40rem each row is a block: the first cell names it, and the head moves into the other cells as their labels. */
const TABLE_STACKED = [
	"max-sm:block max-sm:[&_tbody]:block max-sm:[&_tr]:block max-sm:[&_td]:block max-sm:[&_thead]:hidden",
	"max-sm:[&_tr]:border-b max-sm:[&_tr]:border-zinc-200 max-sm:[&_tr]:py-4",
	"max-sm:[&_td]:border-0 max-sm:[&_td]:py-1.5 max-sm:[&_td]:pe-0 max-sm:[&_td]:text-left",
	"max-sm:[&_td:first-child]:text-[1rem] max-sm:[&_td:first-child]:font-medium max-sm:[&_td:first-child]:text-ink",
	"max-sm:[&_td:not(:first-child)]:before:block max-sm:[&_td:not(:first-child)]:before:text-[0.8125rem] max-sm:[&_td:not(:first-child)]:before:text-zinc-600",
	"max-sm:[&_td:nth-child(2)]:before:content-[var(--l2)] max-sm:[&_td:nth-child(3)]:before:content-[var(--l3)] max-sm:[&_td:nth-child(4)]:before:content-[var(--l4)] max-sm:[&_td:nth-child(5)]:before:content-[var(--l5)]",
	"max-sm:[&_td:nth-child(6)]:before:content-[var(--l6)] max-sm:[&_td:nth-child(7)]:before:content-[var(--l7)] max-sm:[&_td:nth-child(8)]:before:content-[var(--l8)]",
].join(" ");

/* Under 40rem a scrolling table holds its first column in place, so a row keeps its name. */
const TABLE_PINNED =
	"max-sm:[&_td:first-child]:sticky max-sm:[&_td:first-child]:left-0 max-sm:[&_td:first-child]:z-1 max-sm:[&_td:first-child]:bg-paper max-sm:[&_th:first-child]:sticky max-sm:[&_th:first-child]:left-0 max-sm:[&_th:first-child]:z-1 max-sm:[&_th:first-child]:bg-paper";

/*
 * A table of three columns or fewer always fits its column. A wider one
 * scrolls sideways on a small screen, unless its rows are long: 90 characters
 * a row is about where a phone shows one column at a time, so those stack.
 * A scrolling one pins its row names when they are short enough to leave room
 * for the columns passing beside them.
 */
function DocumentTable({ children, style, ...props }: ComponentProps<"table">) {
	const { labels, longestRow, longestName } = measureTable(children);
	const wide = labels.length >= 4;
	const stacked = wide && longestRow > 90;
	const pinned = wide && !stacked && longestName <= 20;
	const labelled = stacked
		? ({
				...style,
				...Object.fromEntries(labels.map((label, i) => [`--l${i + 1}`, JSON.stringify(label)])),
			} as CSSProperties)
		: style;
	return (
		<div className={`my-8 max-w-none! overflow-x-auto ${FOCUS}`}>
			<div className={stacked ? `${TABLE_FRAME} max-sm:w-full! max-sm:max-w-full!` : TABLE_FRAME}>
				<table {...props} className={stacked ? TABLE_STACKED : pinned ? TABLE_PINNED : undefined} style={labelled}>
					{children}
				</table>
			</div>
		</div>
	);
}

function CodeActions({ children }: { children?: ReactNode }) {
	return (
		<div className="absolute top-0 right-0 z-2 bg-paper-2 p-0.5 text-zinc-600 empty:hidden [&_button]:size-11">
			{children}
		</div>
	);
}

/* Keeps a line of code clear of the copy button, which fills 48px of the block's corner. */
const CODE_VIEWPORT = { style: { "--padding-right": "calc(var(--spacing) * 14)" } as CSSProperties };

function DocumentCode({ ref: _ref, ...props }: ComponentProps<"pre">) {
	return (
		<CodeBlock {...props} className="border-0 bg-paper-2" Actions={CodeActions} viewportProps={CODE_VIEWPORT}>
			<Pre>{props.children}</Pre>
		</CodeBlock>
	);
}

/* A tinted well for a note set apart from the text. No outline: the tint is the edge. */
function DocumentCallout({ title, children }: { title?: ReactNode; children?: ReactNode }) {
	return (
		<aside className="my-6 rounded-card bg-paper-2 px-6 py-5">
			{title ? <div className={`${SMALL} font-medium text-ink`}>{title}</div> : null}
			<div className="mt-1 [&>:first-child]:mt-0 [&>:last-child]:mb-0">{children}</div>
		</aside>
	);
}

export function getDocumentComponents(components?: MDXComponents) {
	return getMDXComponents({
		h2: heading("h2", DOC_H2),
		h3: heading("h3", DOC_H3),
		h4: heading("h4", DOC_H4),
		pre: DocumentCode,
		table: DocumentTable,
		Callout: DocumentCallout,
		...components,
	});
}
