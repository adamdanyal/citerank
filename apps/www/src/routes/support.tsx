import { createFileRoute, Link } from "@tanstack/react-router";
import { CRISP_WEBSITE_ID } from "@workspace/config/constants";
import { buttonVariants } from "@workspace/ui/components/button";
import { Spinner } from "@workspace/ui/components/spinner";
import { ArrowUpRight } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
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

function ContactCard({ heading, body, action }: { heading: string; body: string; action: ReactNode }) {
	return (
		<div className="flex flex-col rounded-md border border-zinc-200 bg-white p-6">
			<h2 className="text-lg font-semibold text-zinc-950">{heading}</h2>
			<p className="mt-2 flex-1 text-sm text-zinc-600">{body}</p>
			<div className="mt-5">{action}</div>
		</div>
	);
}

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
			<a href={`mailto:${SUPPORT_EMAIL}`} className={buttonVariants({ variant: "default", size: "sm" })}>
				Start a Chat
			</a>
		);
	}

	return (
		<button
			type="button"
			onClick={start}
			disabled={opening}
			className={buttonVariants({ variant: "default", size: "sm" })}
		>
			{opening && <Spinner />}
			{opening ? "Opening Chat…" : "Start a Chat"}
		</button>
	);
}

function ExternalButton({ href, children }: { href: string; children: ReactNode }) {
	return (
		<a
			href={href}
			target="_blank"
			rel={externalRel(href)}
			className={buttonVariants({ variant: "outline", size: "sm" })}
		>
			{children}
			<ArrowUpRight className="size-3.5" />
		</a>
	);
}

function ResourceLink({ href, label, detail }: { href: string; label: string; detail: string }) {
	const external = href.startsWith("http");
	return (
		<a
			href={href}
			{...(external ? { target: "_blank", rel: externalRel(href) } : {})}
			className="group flex items-start justify-between gap-4 rounded-md border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50"
		>
			<div>
				<p className="text-sm font-medium text-zinc-950 group-hover:text-blue-600">{label}</p>
				<p className="mt-1 text-xs text-zinc-500">{detail}</p>
			</div>
			{external && <ArrowUpRight className="size-4 shrink-0 text-zinc-400" />}
		</a>
	);
}

function SupportPage() {
	return (
		<div className="min-h-screen">
			<Navbar />
			<main className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:py-20">
				<header className="mb-16 space-y-4">
					<h1 className="font-heading text-4xl text-zinc-950 lg:text-5xl">Support</h1>
					<p className="max-w-2xl text-lg text-balance text-zinc-600">
						Questions about your account, billing, the MCP server, or the AI search agency? Here is how to reach us.
					</p>
				</header>

				<section className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<ContactCard
						heading="Chat With Us"
						body="The fastest way to reach the team, for anything from sign-in trouble to questions about your data."
						action={<StartChatButton />}
					/>
					<ContactCard
						heading="Email"
						body="For account, billing, data and anything that needs a longer answer. Include your organization name."
						action={
							<a href={`mailto:${SUPPORT_EMAIL}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
								{SUPPORT_EMAIL}
							</a>
						}
					/>
					<ContactCard
						heading="Book a Call"
						body="Walk through your results, or the work our AI search agency would do, with someone from the team."
						action={
							<Link to="/agency" className={buttonVariants({ variant: "outline", size: "sm" })}>
								Book a Time
							</Link>
						}
					/>
					<ContactCard
						heading="Community"
						body="Join CiteRank.com on LinkedIn for product releases, AEO and GEO guides, and AI search news from the team."
						action={<ExternalButton href={LINKEDIN_URL}>Join on LinkedIn</ExternalButton>}
					/>
					<ContactCard
						heading="Bugs and Feature Requests"
						body="Report bugs and request features by email, and we'll follow up with you after a fix or release."
						action={
							<a
								href={`mailto:${SUPPORT_EMAIL}?subject=Bug%20report%20or%20feature%20request`}
								className={buttonVariants({ variant: "outline", size: "sm" })}
							>
								Report an Issue
							</a>
						}
					/>
					<ContactCard
						heading="Security"
						body="Report vulnerabilities privately by email rather than in a public post."
						action={
							<a
								href={`mailto:${SUPPORT_EMAIL}?subject=Security%20report`}
								className={buttonVariants({ variant: "outline", size: "sm" })}
							>
								Email Your Report
							</a>
						}
					/>
				</section>

				<section>
					<h2 className="mb-6 text-xl font-semibold text-zinc-950">Before You Write</h2>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<ResourceLink href="/docs" label="Documentation" detail="Setup, features, and integration guides." />
						<ResourceLink
							href="/docs/api/mcp"
							label="MCP Server"
							detail="Connecting CiteRank.com to ChatGPT, Claude, Cursor, and other clients."
						/>
						<ResourceLink href="/docs/api" label="API Reference" detail="Every endpoint, with examples." />
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
