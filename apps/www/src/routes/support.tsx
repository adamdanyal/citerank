import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@workspace/ui/components/button";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { externalRel } from "@/lib/external-link";
import { breadcrumbJsonLd, canonicalUrl, ogMeta } from "@/lib/seo";

const title = "Support · CiteRank.com";
const description =
	"Get help with CiteRank.com: email the team about your account, billing or data, or book an agency call.";

const SUPPORT_EMAIL = "team@citerank.com";

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
						Questions about your account, billing, your data or the MCP server? Email the team and a person answers.
					</p>
				</header>

				<section className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<ContactCard
						heading="Email"
						body="For account, billing, data and anything that needs a longer answer. Include your organization name so we can find your account."
						action={
							<a href={`mailto:${SUPPORT_EMAIL}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
								{SUPPORT_EMAIL}
							</a>
						}
					/>
					<ContactCard
						heading="Book a Call"
						body="Want our AI search agency to do the work the tracker ranks? Book a call to talk it through."
						action={
							<Link to="/agency" className={buttonVariants({ variant: "outline", size: "sm" })}>
								Book a Time
							</Link>
						}
					/>
					<ContactCard
						heading="Security"
						body="Report vulnerabilities privately by email, with the steps to reproduce them."
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
						<ResourceLink href="/docs" label="Documentation" detail="Brand and prompt setup, and reading results." />
						<ResourceLink
							href="/docs/api/mcp"
							label="MCP Server"
							detail="Connecting CiteRank.com to Claude, Cursor and other AI assistants."
						/>
						<ResourceLink href="/docs/api" label="API Reference" detail="Every endpoint, with examples." />
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
