import { Link } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { cloudSignupUrl } from "@workspace/config/referrals";
import { buttonVariants } from "@workspace/ui/components/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

const SIGN_UP_URL = cloudSignupUrl("marketing-page-cta");

export function DirectoryBackLink({ label = "AI Visibility Tool Directory" }: { label?: string }) {
	return (
		<div className="mx-auto max-w-6xl px-4 pt-8 md:px-6">
			<Link
				to="/ai-visibility-tools"
				className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950"
			>
				<ArrowLeft className="h-3 w-3" />
				{label}
			</Link>
		</div>
	);
}

/**
 * Page hero with an H1 and a lead "answer block" written to be
 * lifted verbatim into an AI answer. Mirrors the comparison page hero.
 */
export function DirectoryHero({ title, lead, children }: { title: string; lead: string; children?: ReactNode }) {
	return (
		<section className="border-b border-zinc-200 bg-white py-12 lg:py-20">
			<div className="mx-auto max-w-6xl px-4 md:px-6">
				<h1 className="font-heading text-4xl text-balance text-zinc-950 md:text-5xl">{title}</h1>
				<p className="mt-4 max-w-3xl text-lg text-balance text-zinc-600">{lead}</p>
				{children ? <div className="mt-8">{children}</div> : null}
			</div>
		</section>
	);
}

/**
 * The "Elmo: the open-source alternative" banner, surfaced high on a page right
 * under the hero. `pitch` is the page-specific paragraph; `comparison` points the
 * secondary button at the matching Elmo-vs comparison page.
 */
export function DirectoryCiteRankBanner({
	pitch,
	comparison,
}: {
	pitch: string;
	comparison: { slug: string; name: string };
}) {
	return (
		<section className="border-b border-zinc-200 bg-zinc-50 py-10">
			<div className="mx-auto max-w-6xl px-4 md:px-6">
				<div className="rounded-md border border-blue-200 bg-blue-50/40 p-6">
					<h2 className="font-heading text-xl text-zinc-950">CiteRank.com: A Tracker and an AI Search Agency</h2>
					<p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600">{pitch}</p>
					<div className="mt-4 flex flex-wrap gap-3">
						<a href={SIGN_UP_URL} className={buttonVariants({ size: "sm" })}>
							Start Tracking
						</a>
						<Link
							to="/ai-visibility-tools/$slug"
							params={{ slug: comparison.slug }}
							className={buttonVariants({ variant: "outline", size: "sm" })}
						>
							CiteRank.com vs {comparison.name}
							<ArrowRight className="h-3.5 w-3.5" />
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}

export function CiteRankCta() {
	return (
		<section className="border-b border-zinc-200 bg-white py-16 lg:py-24">
			<div className="mx-auto max-w-3xl px-4 text-center md:px-6">
				<h2 className="font-heading text-3xl text-zinc-950 md:text-4xl">Ready to Track Your AI Visibility?</h2>
				<p className="mx-auto mt-4 max-w-xl text-lg text-balance text-zinc-600">
					Start monitoring how ChatGPT, Claude, Google AI Overviews, and seven more AI apps talk about your brand. Plans
					start at ${CLOUD_ENTRY_PRICE_USD}/mo, or have our AI search agency do the work.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<a href={SIGN_UP_URL} className={buttonVariants({ size: "sm" })}>
						Start Tracking
					</a>
					<Link to="/agency" className={buttonVariants({ variant: "outline", size: "sm" })}>
						Have Us Do the Work
					</Link>
				</div>
			</div>
		</section>
	);
}

export function DirectorySection({ title, children }: { title?: string; children: ReactNode }) {
	return (
		<section className="border-b border-zinc-200 bg-white py-12">
			<div className="mx-auto max-w-6xl px-4 md:px-6">
				{title ? <h2 className="font-heading mb-8 text-2xl text-zinc-950">{title}</h2> : null}
				{children}
			</div>
		</section>
	);
}
