import { ArrowUpRight } from "lucide-react";
import { SocialIcons } from "@/components/citerank/socials";
import { WRAP } from "@/components/citerank/v2/kit";
import { Logo } from "@/components/logo";
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
	{ label: "Acceptable use", href: "/legal/acceptable-use" },
];

const cols: { heading: string; links: FooterLink[] }[] = [
	{
		heading: "Product",
		links: [
			{ label: "Features", href: "/features" },
			{ label: "Pricing", href: "/pricing" },
			{ label: "AI search agency", href: "/agency" },
		],
	},
	{
		heading: "Resources",
		links: [
			{ label: "Blog", href: "/blog" },
			{ label: "Documentation", href: "/docs" },
			{ label: "API reference", href: "/docs/api" },
			{ label: "Support", href: "/support" },
		],
	},
	{
		heading: "Learn",
		links: [
			{ label: "What is AEO?", href: "/answer-engine-optimization" },
			{ label: "What is GEO?", href: "/generative-engine-optimization" },
			{ label: "AEO glossary", href: "/glossary" },
			{ label: "AI search guides", href: "/ai-search" },
			{ label: "AI search statistics", href: "/statistics" },
			{ label: "AEO by industry", href: "/aeo-for" },
		],
	},
	{
		heading: "Tools",
		links: [
			{ label: "Tool directory", href: "/ai-visibility-tools" },
			{ label: "Compare tools", href: "/ai-visibility-tools/compare" },
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

const FOCUS = "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

/* The whole site as an index, on ink: five lists a visitor or a crawler can read down, then the legal line. */
export function Footer() {
	return (
		<footer className="bg-ink text-paper">
			<div className={WRAP}>
				<div className="grid gap-x-8 gap-y-12 py-14 sm:py-20 xl:grid-cols-12">
					<div className="xl:col-span-3">
						<a href="/" aria-label="CiteRank.com home" className={`inline-flex ${FOCUS}`}>
							<Logo className="text-[1.375rem] text-paper" />
						</a>
						<p className="mt-4 max-w-[26ch] text-[0.9375rem] leading-[1.5] text-zinc-400">
							AI visibility tracker and AI search agency.
						</p>
					</div>
					<div className="grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-x-8 gap-y-10 lg:grid-cols-5 xl:col-span-9">
						{cols.map((col) => (
							<div key={col.heading}>
								<h3 className="font-sans text-[0.875rem] font-normal tracking-normal text-zinc-400">{col.heading}</h3>
								<ul className="mt-3 space-y-1">
									{col.links.map((link) => (
										<li key={link.href}>
											<a
												href={link.href}
												target={link.external ? "_blank" : undefined}
												rel={link.external ? externalRel(link.href) : undefined}
												className={`inline-flex items-center gap-1 py-1 text-[0.9375rem] whitespace-nowrap text-zinc-200 transition-colors duration-200 hover:text-paper ${FOCUS}`}
											>
												{link.label}
												{link.external ? <ArrowUpRight className="size-3.5" aria-hidden="true" /> : null}
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<div className="flex flex-col gap-5 border-t border-ink-rule py-8 pb-28 text-[0.875rem] text-zinc-400 md:flex-row md:items-start md:justify-between md:pb-8">
					<div className="flex max-w-3xl flex-col gap-3">
						<p>
							&copy; {new Date().getFullYear()} {COMPANY}. <Trademark {...TRADEMARKS[0]} /> and{" "}
							<Trademark {...TRADEMARKS[1]} /> are registered trade marks.
						</p>
						<nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-1">
							{legalLinks.map((link) => (
								<a
									key={link.href}
									href={link.href}
									className={`py-1 whitespace-nowrap transition-colors duration-200 hover:text-paper ${FOCUS}`}
								>
									{link.label}
								</a>
							))}
						</nav>
					</div>
					<SocialIcons className="shrink-0" linkClassName="text-zinc-400 hover:text-paper" iconClassName="size-5" />
				</div>
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
				className="ml-px inline-flex align-middle transition-colors duration-200 hover:text-paper"
			>
				<ArrowUpRight className="size-3" aria-hidden="true" />
			</a>
		</>
	);
}
