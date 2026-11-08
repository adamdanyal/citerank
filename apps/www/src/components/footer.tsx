import { cn } from "@workspace/ui/lib/utils";
import { ArrowUpRight } from "lucide-react";
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
					<SocialLinks className="gap-4 text-zinc-400" linkClassName="transition-colors hover:text-zinc-950" />
				</div>
			</div>
			{/* A watermark: the wordmark spans the content width and fades out towards its baseline.
			   The viewBox is the ink box of "CiteRank.com" at 100px in the heading font, so it stays edge to edge in any font. */}
			<div aria-hidden="true" className="mx-auto max-w-6xl px-4 pt-4 pb-24 md:px-6 md:pb-10">
				<svg
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

function SocialLinks({
	className,
	linkClassName = "hover:text-zinc-900",
}: {
	className?: string;
	linkClassName?: string;
}) {
	return (
		<div className={cn("flex items-center gap-3", className)}>
			<a href="https://x.com/tryciterank" target="_blank" rel="noopener noreferrer" className={linkClassName}>
				<span className="sr-only">Twitter / X</span>
				<svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
					<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
				</svg>
			</a>
			<a
				href="https://www.linkedin.com/company/citerank"
				target="_blank"
				rel="noopener noreferrer"
				className={linkClassName}
			>
				<span className="sr-only">LinkedIn</span>
				<svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
					<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
				</svg>
			</a>
		</div>
	);
}
