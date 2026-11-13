import { Link } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { cloudSignupUrl } from "@workspace/config/referrals";
import { buttonVariants } from "@workspace/ui/components/button";
import { ArrowRight } from "lucide-react";
import type { Pillar } from "@/data/pillars";
import { MONO, PANEL, PANEL_PAD } from "./citerank/v2/kit";

export function CiteRankCta() {
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<div className="mx-auto max-w-3xl px-4 text-center md:px-6">
				<h2 className="font-heading text-3xl text-zinc-950 md:text-4xl">Ready to track your AI visibility?</h2>
				<p className="mx-auto mt-4 max-w-xl text-lg text-balance text-zinc-600">
					Set up CiteRank.com in minutes and start monitoring how ChatGPT, Claude, and Google AI Overviews talk about
					your brand. Plans start at ${CLOUD_ENTRY_PRICE_USD}/mo.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<a href={cloudSignupUrl("marketing-page-cta")} className={buttonVariants({ size: "sm" })}>
						Start tracking today
					</a>
					<Link to="/agency" className={buttonVariants({ variant: "outline", size: "sm" })}>
						Hire our agency
					</Link>
				</div>
			</div>
		</section>
	);
}

export function PillarBody({ pillar }: { pillar: Pillar }) {
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<div className="mx-auto max-w-6xl px-4 md:px-6">
				<div className="max-w-3xl">
					<div className="rounded-2xl bg-rust/10 p-6 sm:p-7">
						<h2 className="font-mono text-[11px] leading-[1.4] text-blue-900">In short</h2>
						<p className="mt-3 text-lg leading-relaxed text-zinc-800">{pillar.definition}</p>
					</div>

					<nav aria-label="On this page" className="mt-10 rounded-2xl bg-paper-2 p-6 ring-1 ring-zinc-200 sm:p-7">
						<h2 className="font-mono text-[11px] leading-[1.4] text-zinc-500">On this page</h2>
						<ol className="mt-4 space-y-2">
							{pillar.sections.map((section, i) => (
								<li key={section.id} className="flex gap-3 text-sm">
									<span className="font-mono text-zinc-500 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
									<a href={`#${section.id}`} className="text-zinc-700 transition-colors hover:text-zinc-950">
										{section.heading}
									</a>
								</li>
							))}
						</ol>
					</nav>

					{pillar.sections.map((section) => (
						<div key={section.id} className="mt-12 scroll-mt-24" id={section.id}>
							<h2 className="font-heading text-2xl text-zinc-950">{section.heading}</h2>
							<div className="mt-5 space-y-5 text-lg leading-relaxed text-zinc-700">
								{section.body.map((paragraph) => (
									<p key={paragraph.slice(0, 40)}>{paragraph}</p>
								))}
							</div>

							{section.steps ? (
								<ol className="mt-6 space-y-5">
									{section.steps.map((step, i) => (
										<li key={step.name} className="flex gap-4">
											<span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rust font-mono text-xs text-paper tabular-nums">
												{i + 1}
											</span>
											<div>
												<h3 className="font-semibold text-zinc-950">{step.name}</h3>
												<p className="mt-1 leading-relaxed text-zinc-600">{step.text}</p>
											</div>
										</li>
									))}
								</ol>
							) : null}

							{section.bullets ? (
								<ul className="mt-6 space-y-3">
									{section.bullets.map((bullet) => (
										<li key={bullet.slice(0, 40)} className="flex gap-3 leading-relaxed text-zinc-600">
											<span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-300" />
											<span>{bullet}</span>
										</li>
									))}
								</ul>
							) : null}

							{section.callout ? (
								<div className="mt-8 rounded-2xl bg-paper-2 p-6 ring-1 ring-zinc-200 sm:p-7">
									<h3 className="font-semibold text-zinc-950">{section.callout.heading}</h3>
									<p className="mt-2 leading-relaxed text-zinc-600">{section.callout.text}</p>
								</div>
							) : null}
						</div>
					))}

					<div className="mt-14 border-t border-zinc-200 pt-8">
						<h2 className="font-mono text-[11px] leading-[1.4] text-zinc-500">Keep reading</h2>
						<div className="mt-4 grid gap-3 sm:grid-cols-2">
							{pillar.related.map((link) => (
								<a
									key={link.href}
									href={link.href}
									className="group rounded-2xl bg-paper-2 p-5 ring-1 ring-zinc-200 transition-[box-shadow] duration-200 hover:ring-zinc-400"
								>
									<span className="flex items-center gap-1.5 font-semibold text-zinc-950">
										{link.label}
										<ArrowRight className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
									</span>
									<span className="mt-1 block text-sm leading-relaxed text-zinc-600">{link.description}</span>
								</a>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
