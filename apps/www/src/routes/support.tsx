import { createFileRoute, Link } from "@tanstack/react-router";
import { CRISP_WEBSITE_ID } from "@workspace/config/constants";
import { Spinner } from "@workspace/ui/components/spinner";
import {
	ArrowUpRight,
	Bug,
	CalendarDays,
	type LucideIcon,
	Mail,
	MessageCircle,
	ShieldCheck,
	Users,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import {
	CARD,
	Container,
	ICON_BOX,
	LINK_CARD,
	PRIMARY_BUTTON,
	Reveal,
	RevealItem,
	SECONDARY_BUTTON,
} from "@/components/citerank/ui";
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
			<a href={`mailto:${SUPPORT_EMAIL}`} className={PRIMARY_BUTTON}>
				Start a chat
			</a>
		);
	}

	return (
		<button type="button" onClick={start} disabled={opening} className={PRIMARY_BUTTON}>
			{opening && <Spinner />}
			{opening ? "Opening chat…" : "Start a chat"}
		</button>
	);
}

function ContactCard({
	icon: Icon,
	heading,
	body,
	action,
	delay,
}: {
	icon: LucideIcon;
	heading: string;
	body: string;
	action: ReactNode;
	delay: number;
}) {
	return (
		<RevealItem delay={delay} className={`${CARD} flex flex-col p-6 lg:p-8`}>
			<span className={ICON_BOX}>
				<Icon className="size-5" aria-hidden="true" />
			</span>
			<h2 className="title-1 mt-6 text-zinc-950">{heading}</h2>
			<p className="body-6 mt-2 flex-1 text-zinc-600">{body}</p>
			<div className="mt-6">{action}</div>
		</RevealItem>
	);
}

const RESOURCES = [
	{ href: "/docs", label: "Documentation", detail: "Setup, features and integration guides." },
	{
		href: "/docs/api/mcp",
		label: "MCP Server",
		detail: "Connecting CiteRank.com to ChatGPT, Claude, Cursor and other clients.",
	},
	{ href: "/docs/api", label: "API Reference", detail: "Every endpoint, with examples." },
];

function SupportPage() {
	return (
		<div className="min-h-screen bg-white antialiased">
			<Navbar />
			<main>
				<section className="-mt-16 bg-paper">
					<Container className="pt-32 pb-16 lg:pt-40 lg:pb-20">
						<div className="max-w-3xl">
							<p className="caption-3 text-blue-800">Support</p>
							<h1 className="heading-1 mt-6 text-zinc-950">How Can We Help?</h1>
							<p className="body-8 mt-6 max-w-[60ch] text-zinc-600">
								For your account, billing, the MCP server or the AI search agency, here is how to reach the team.
							</p>
						</div>
					</Container>
				</section>

				<section className="bg-white">
					<Container className="py-20 lg:py-24">
						<ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
							<ContactCard
								icon={MessageCircle}
								heading="Chat With Us"
								body="The fastest way to reach the team, for anything from sign-in trouble to questions about your data."
								action={<StartChatButton />}
								delay={0}
							/>
							<ContactCard
								icon={Mail}
								heading="Email"
								body="For account, billing, data and anything that needs a longer answer. Include your organization name."
								action={
									<a href={`mailto:${SUPPORT_EMAIL}`} className={SECONDARY_BUTTON}>
										{SUPPORT_EMAIL}
									</a>
								}
								delay={60}
							/>
							<ContactCard
								icon={CalendarDays}
								heading="Book a Call"
								body="Walk through your results, or the work our AI search agency would do, with someone from the team."
								action={
									<Link to="/agency" className={SECONDARY_BUTTON}>
										Book a time
									</Link>
								}
								delay={120}
							/>
							<ContactCard
								icon={Users}
								heading="Community"
								body="Follow CiteRank.com on LinkedIn for product releases, AEO and GEO guides, and AI search news from the team."
								action={
									<a href={LINKEDIN_URL} target="_blank" rel={externalRel(LINKEDIN_URL)} className={SECONDARY_BUTTON}>
										Follow on LinkedIn
										<ArrowUpRight className="size-4" aria-hidden="true" />
									</a>
								}
								delay={0}
							/>
							<ContactCard
								icon={Bug}
								heading="Bugs and Feature Requests"
								body="Report bugs and request features by email, and we'll follow up with you after a fix or release."
								action={
									<a
										href={`mailto:${SUPPORT_EMAIL}?subject=Bug%20report%20or%20feature%20request`}
										className={SECONDARY_BUTTON}
									>
										Report an issue
									</a>
								}
								delay={60}
							/>
							<ContactCard
								icon={ShieldCheck}
								heading="Security"
								body="Report vulnerabilities privately by email rather than in a public post."
								action={
									<a href={`mailto:${SUPPORT_EMAIL}?subject=Security%20report`} className={SECONDARY_BUTTON}>
										Email your report
									</a>
								}
								delay={120}
							/>
						</ul>
					</Container>
				</section>

				<section className="bg-paper-2">
					<Container className="grid gap-10 py-20 lg:grid-cols-12 lg:gap-16 lg:py-24">
						<Reveal className="lg:col-span-4">
							<h2 className="heading-3 text-zinc-950">Before You Write</h2>
							<p className="body-6 mt-4 text-zinc-600">Most setup and integration questions are answered here.</p>
						</Reveal>
						<ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
							{RESOURCES.map((resource, index) => (
								<RevealItem key={resource.href} delay={index * 60} className="flex">
									<a href={resource.href} className={LINK_CARD}>
										<span className="title-3 text-zinc-950">{resource.label}</span>
										<span className="body-6 mt-2 text-zinc-600">{resource.detail}</span>
									</a>
								</RevealItem>
							))}
						</ul>
					</Container>
				</section>
			</main>
			<Footer />
		</div>
	);
}
