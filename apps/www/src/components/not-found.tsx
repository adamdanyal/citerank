import { Link } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { ACTION, ACTION_QUIET, BODY, PanelHead, SUBHEAD } from "./citerank/v2/kit";
import { PageHead, PageShell, PanelSection } from "./citerank/v2/shell";

const suggestedLinks = [
	{ label: "Documentation", href: "/docs", description: "Get started and learn the API" },
	{ label: "Features", href: "/features", description: "What CiteRank.com can do for your brand" },
	{ label: "Pricing", href: "/pricing", description: `Three tracker plans, from $${CLOUD_ENTRY_PRICE_USD} a month` },
	{ label: "Agency", href: "/agency", description: "Have us do the work for you" },
];

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

export function NotFound() {
	return (
		<PageShell>
			<PageHead title="This page doesn’t exist" lede="It may have moved, or it may never have existed.">
				<div className="flex flex-col gap-3 sm:flex-row">
					<Link to="/" className={ACTION}>
						Back to home
					</Link>
					<Link to="/docs" className={ACTION_QUIET}>
						Read the docs
					</Link>
				</div>
			</PageHead>

			<PanelSection>
				<PanelHead title="Popular pages" />
				<ul className="mt-10 border-b border-zinc-200 lg:mt-16">
					{suggestedLinks.map((link) => (
						<li
							key={link.href}
							className="group relative grid gap-2 border-t border-zinc-200 py-6 lg:grid-cols-12 lg:gap-8 lg:py-8"
						>
							<h3 className={`${SUBHEAD} text-ink lg:col-span-5`}>
								<a
									href={link.href}
									className={`rounded-sm transition-colors duration-200 after:absolute after:inset-0 group-hover:text-blue-800 ${FOCUS}`}
								>
									{link.label}
								</a>
							</h3>
							<p className={`${BODY} max-w-[60ch] text-zinc-600 lg:col-span-7`}>{link.description}</p>
						</li>
					))}
				</ul>
			</PanelSection>
		</PageShell>
	);
}
