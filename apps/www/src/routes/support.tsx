import { createFileRoute, Link } from "@tanstack/react-router";
import { CRISP_WEBSITE_ID } from "@workspace/config/constants";
import { Spinner } from "@workspace/ui/components/spinner";
import { type ReactNode, useState } from "react";
import {
	ACTION,
	ACTION_QUIET,
	BODY,
	LEAD,
	PANEL,
	PANEL_PAD_WIDE,
	Page,
	PanelHead,
	SUBHEAD,
} from "@/components/citerank/v2/kit";
import { PageHead, PageShell } from "@/components/citerank/v2/shell";
import { openCrispChat } from "@/lib/crisp";
import { externalRel } from "@/lib/external-link";
import { breadcrumbJsonLd, canonicalUrl, ogMeta } from "@/lib/seo";

const title = "Support · CiteRank.com";
const description =
	"Get help with CiteRank.com: chat with the team, email support, book a call, or join the community.";

const SUPPORT_EMAIL = "team@citerank.com";
const LINKEDIN_URL = "https://www.linkedin.com/company/citerank";

export const Route = createFileRoute("/support")({
	head: () => ({
		meta: [
			{ title },
			{ name: "description", content: description },
			...ogMeta({ title, description, path: "/support" }),
		],
		links: [{ rel: "canonical", href: canonicalUrl("/support") }],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "Support", path: "/support" },
			]),
		],
	}),
	component: SupportPage,
});

/* Every way in is the same width, so the six actions read as one column and the filled one is where to start. */
const WAY_IN = "w-full sm:w-auto lg:w-full";

// Stops a click that's still waiting on Crisp from spinning forever if the event never comes.
const CHAT_OPEN_TIMEOUT_MS = 15_000;

function StartChatButton() {
	const [opening, setOpening] = useState(false);

	function start() {
		setOpening(true);
		const timeout = window.setTimeout(() => setOpening(false), CHAT_OPEN_TIMEOUT_MS);
		openCrispChat(() => {
			window.clearTimeout(timeout);
			setOpening(false);
		});
	}

	// Crisp never loads without a website ID, so until one is set the button emails the team instead.
	if (!CRISP_WEBSITE_ID) {
		return (
			<a href={`mailto:${SUPPORT_EMAIL}`} className={`${ACTION} ${WAY_IN}`}>
				Start a chat
			</a>
		);
	}

	return (
		<button type="button" onClick={start} disabled={opening} className={`${ACTION} ${WAY_IN}`}>
			{opening && <Spinner />}
			{opening ? "Opening chat…" : "Start a chat"}
		</button>
	);
}

function ContactRow({ title, children, action }: { title: string; children: ReactNode; action: ReactNode }) {
	return (
		<li className="grid gap-x-8 gap-y-2 border-t border-zinc-200 py-6 lg:grid-cols-12 lg:items-center lg:py-8">
			<h3 className={`${SUBHEAD} text-ink lg:col-span-4`}>{title}</h3>
			<p className={`${BODY} max-w-[52ch] text-zinc-600 lg:col-span-5`}>{children}</p>
			<div className="mt-3 lg:col-span-3 lg:mt-0">{action}</div>
		</li>
	);
}

const RESOURCES = [
	{ href: "/docs", label: "Documentation", detail: "Setup, features and integration guides." },
	{
		href: "/docs/api/mcp",
		label: "MCP server",
		detail: "Connecting CiteRank.com to ChatGPT, Claude, Cursor and other clients.",
	},
	{ href: "/docs/api", label: "API reference", detail: "Every endpoint, with examples." },
];

/* The six ways to reach the team, then where the answer may already be written down. */
function SupportPage() {
	return (
		<PageShell>
			<PageHead
				title="How can we help?"
				lede="For your account, billing, the MCP server or the AI search agency, here is how to reach the team."
			/>

			{/* The rows bring their own space above the first hairline, so the section adds less than a full gap. */}
			<section className={`${PANEL} pt-3 pb-9 sm:pt-5 sm:pb-12 lg:pt-10 lg:pb-18`}>
				<Page>
					<h2 className="sr-only">How to reach the team</h2>
					<ul className="border-b border-zinc-200">
						<ContactRow title="Chat with us" action={<StartChatButton />}>
							The fastest way to reach the team, for anything from sign-in trouble to questions about your data.
						</ContactRow>
						<ContactRow
							title="Email"
							action={
								<a href={`mailto:${SUPPORT_EMAIL}`} className={`${ACTION_QUIET} ${WAY_IN}`}>
									{SUPPORT_EMAIL}
								</a>
							}
						>
							For account, billing, data and anything that needs a longer answer. Include your organization name.
						</ContactRow>
						<ContactRow
							title="Book a call"
							action={
								<Link to="/agency" className={`${ACTION_QUIET} ${WAY_IN}`}>
									Book a time
								</Link>
							}
						>
							Walk through your results, or the work our AI search agency would do, with someone from the team.
						</ContactRow>
						<ContactRow
							title="Community"
							action={
								<a
									href={LINKEDIN_URL}
									target="_blank"
									rel={externalRel(LINKEDIN_URL)}
									className={`${ACTION_QUIET} ${WAY_IN}`}
								>
									Follow on LinkedIn
								</a>
							}
						>
							Follow CiteRank.com on LinkedIn for product releases, AEO and GEO guides, and AI search news from the
							team.
						</ContactRow>
						<ContactRow
							title="Bugs and feature requests"
							action={
								<a
									href={`mailto:${SUPPORT_EMAIL}?subject=Bug%20report%20or%20feature%20request`}
									className={`${ACTION_QUIET} ${WAY_IN}`}
								>
									Report an issue
								</a>
							}
						>
							Report bugs and request features by email, and we’ll follow up with you after a fix or release.
						</ContactRow>
						<ContactRow
							title="Security"
							action={
								<a href={`mailto:${SUPPORT_EMAIL}?subject=Security%20report`} className={`${ACTION_QUIET} ${WAY_IN}`}>
									Email your report
								</a>
							}
						>
							Report vulnerabilities privately by email rather than in a public post.
						</ContactRow>
					</ul>
				</Page>
			</section>

			<section className={`${PANEL} ${PANEL_PAD_WIDE}`}>
				<Page>
					<PanelHead title="Before you write">
						<p className={`${LEAD} text-zinc-600`}>Most setup and integration questions are answered here.</p>
					</PanelHead>
					<ul className="mt-10 grid gap-x-8 md:grid-cols-3 lg:mt-16">
						{RESOURCES.map((resource) => (
							<li key={resource.href} className="border-t border-zinc-200">
								<a
									href={resource.href}
									className="group block rounded-sm py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust"
								>
									<h3
										className={`${SUBHEAD} text-ink underline-offset-4 group-hover:underline group-hover:decoration-rust`}
									>
										{resource.label}
									</h3>
									<p className={`${BODY} mt-2 max-w-[40ch] text-zinc-600`}>{resource.detail}</p>
								</a>
							</li>
						))}
					</ul>
				</Page>
			</section>
		</PageShell>
	);
}
