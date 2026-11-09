import { ArrowUpRight } from "lucide-react";
import { SocialIcons } from "@/components/citerank/socials";
import { externalRel } from "@/lib/external-link";

type FooterLink = { label: string; href: string; external?: boolean };

const COMPANY = "Danx Digital Limited";

const TRADEMARKS = [
	{ name: "CiteRank", number: "UK00004430998" },
	{ name: "CiteRank.com", number: "UK00004399266" },
];

const legalLinks = [
	{ label: "Terms", href: "/legal/terms" },
	{ label: "Privacy", href: "/legal/privacy" },
	{ label: "Cookies", href: "/legal/cookies" },
	{ label: "Subprocessors", href: "/legal/subprocessors" },
	{ label: "Acceptable Use", href: "/legal/acceptable-use" },
];

const cols: { heading: string; links: FooterLink[] }[] = [
	{
		heading: "Product",
		links: [
			{ label: "Features", href: "/features" },
			{ label: "Pricing", href: "/pricing" },
			{ label: "AI Search Agency", href: "/agency" },
		],
	},
	{
		heading: "Resources",
		links: [
			{ label: "Blog", href: "/blog" },
			{ label: "Documentation", href: "/docs" },
			{ label: "API Reference", href: "/docs/api" },
			{ label: "Support", href: "/support" },
		],
	},
	{
		heading: "Learn",
		links: [
			{ label: "What is AEO?", href: "/answer-engine-optimization" },
			{ label: "What is GEO?", href: "/generative-engine-optimization" },
			{ label: "AEO Glossary", href: "/glossary" },
			{ label: "AI Search Guides", href: "/ai-search" },
			{ label: "AI Search Statistics", href: "/statistics" },
			{ label: "AEO by Industry", href: "/aeo-for" },
		],
	},
	{
		heading: "Tools",
		links: [
			{ label: "Tool Directory", href: "/ai-visibility-tools" },
			{ label: "Compare Tools", href: "/ai-visibility-tools/compare" },
		],
	},
	{
		heading: "Company",
		links: [
			{ label: "About", href: "/about" },
			{ label: "llms.txt", href: "/llms.txt" },
		],
	},
];

export function Footer() {
	return (
		<footer className="border-t border-zinc-200/80 bg-white">
			<div className="mx-auto max-w-6xl px-4 md:px-6">
				<div className="grid grid-cols-2 gap-10 py-16 sm:grid-cols-3 lg:grid-cols-5">
					{cols.map((col) => (
						<div key={col.heading}>
							<h3 className="text-sm font-medium text-zinc-950">{col.heading}</h3>
							<ul className="mt-4 space-y-3 text-sm">
								{col.links.map((link) => (
									<li key={link.href}>
										<a
											href={link.href}
											target={link.external ? "_blank" : undefined}
											rel={link.external ? externalRel(link.href) : undefined}
											className="group inline-flex items-center gap-1 text-zinc-600 transition-colors hover:text-blue-600"
										>
											{link.label}
											{link.external ? (
												<ArrowUpRight
													className="size-3 opacity-50 transition group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100"
													aria-hidden="true"
												/>
											) : null}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="flex flex-col gap-4 border-t border-zinc-200/80 py-6 text-xs text-zinc-500 md:flex-row md:items-start md:justify-between">
					<div className="flex max-w-3xl flex-col gap-3">
						<p>
							&copy; {new Date().getFullYear()} {COMPANY}. <Trademark {...TRADEMARKS[0]} /> and{" "}
							<Trademark {...TRADEMARKS[1]} /> are registered trade marks.
						</p>
						<nav aria-label="Legal" className="flex flex-wrap items-center gap-x-4 gap-y-2">
							{legalLinks.map((link) => (
								<a key={link.href} href={link.href} className="hover:text-zinc-950">
									{link.label}
								</a>
							))}
						</nav>
					</div>
					<SocialIcons className="shrink-0" />
				</div>
			</div>
			{/* A watermark: the wordmark spans the content width and fades out towards its baseline.
			   The viewBox is the ink box of "CiteRank.com" at 100px in the heading font, so it stays edge to edge in any font. */}
			<div aria-hidden="true" className="mx-auto max-w-6xl px-4 pt-4 pb-24 md:px-6 md:pb-10">
				<svg
					aria-hidden="true"
					viewBox="4 0 630 79"
					className="block w-full select-none fill-zinc-300 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]"
				>
					<text x="0" y="77" fontSize="100" textLength="638" lengthAdjust="spacing" className="font-heading">
						CiteRank.com
					</text>
				</svg>
			</div>
		</footer>
	);
}

/* The name is plain text; only the arrow after it opens the mark's UK IPO record. */
function Trademark({ name, number }: { name: string; number: string }) {
	const href = `https://trademarks.ipo.gov.uk/ipo-tmcase/page/Results/1/${number}`;
	return (
		<>
			{name}
			<a
				href={href}
				target="_blank"
				rel={externalRel(href)}
				title={`UK trade mark ${number}`}
				aria-label={`${name} trade mark record`}
				className="ml-px inline-flex align-middle opacity-50 transition hover:-translate-y-px hover:translate-x-px hover:text-zinc-950 hover:opacity-100"
			>
				<ArrowUpRight className="size-3" aria-hidden="true" />
			</a>
		</>
	);
}
