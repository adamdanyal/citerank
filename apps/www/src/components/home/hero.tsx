import { Link } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { cloudSignupUrl, demoSiteUrl, type ReferralSource } from "@workspace/config/referrals";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { externalRel } from "@/lib/external-link";
import { DEMO_BRAND_PATH, ProductDemo } from "./product-demo";

// One size and box model for both buttons, so they sit on the same line.
const BUTTON =
	"inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-base font-medium leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";
const QUIET =
	"rounded-sm font-medium text-zinc-600 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-950 hover:decoration-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

const BADGE = (
	<span className="inline-flex h-7 items-center rounded-full bg-white/80 px-3 text-xs font-medium text-zinc-600 shadow-sm ring-1 ring-zinc-200">
		AI Visibility Tracker + AI Search Agency
	</span>
);

function titleWords(title: string) {
	let at = 0;
	return title.split(" ").map((word) => {
		const entry = { word, at };
		at += word.length + 1;
		return entry;
	});
}

const DEFAULT_LEDE =
	"CiteRank.com is the AI visibility tracker and AI search agency for AEO and GEO. See how ChatGPT, Claude, Gemini and ten other AI apps talk about your brand and what to fix. Do it yourself, or have our agency do it every month.";

/** Landing pages for a single audience reuse the homepage hero with their own pitch. */
export function Hero({
	badge = BADGE,
	title = "Track your brand in AI search",
	lede = DEFAULT_LEDE,
	from = "marketing-hero",
}: {
	badge?: ReactNode;
	title?: string;
	lede?: ReactNode;
	from?: ReferralSource;
} = {}) {
	const signupUrl = cloudSignupUrl(from);
	const demoUrl = demoSiteUrl(from, DEMO_BRAND_PATH);
	// The display size suits a short slogan; a longer headline steps down so it holds to two lines.
	const short = title.length <= 16;

	return (
		<section className="relative overflow-hidden bg-paper">
			<div aria-hidden="true" className="pointer-events-none absolute inset-0" />

			<div className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 md:px-6 md:pt-20 lg:pb-28">
				<div className="mx-auto flex max-w-3xl flex-col items-center text-center">
					{badge}

					<h1
						className={`mt-8 font-semibold text-balance text-zinc-950 ${short ? "whitespace-nowrap text-[min(11.5vw,3.5rem)] leading-[0.95] tracking-[-0.045em] sm:text-7xl lg:text-[6.25rem]" : "text-[min(11.5vw,2.75rem)] leading-[1] tracking-[-0.04em] sm:text-6xl lg:text-7xl"}`}
					>
						{titleWords(title).map(({ word, at }) => (
							<Fragment key={at}>
								{at > 0 ? " " : null}
								{/* A display-size line break at a hyphen ("e-" / "commerce") reads as a typo. */}
								{word.includes("-") ? <span className="whitespace-nowrap">{word}</span> : word}
							</Fragment>
						))}
					</h1>
					<p className="mt-6 max-w-[60ch] text-balance text-[17px]/7 text-zinc-600 md:text-xl/8">{lede}</p>
					<div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
						<a href={signupUrl} className={`${BUTTON} bg-blue-600 text-white hover:bg-blue-700`}>
							Start tracking
							<ArrowRight className="size-4" aria-hidden="true" />
						</a>
						<Link
							to="/agency"
							className={`${BUTTON} bg-white text-zinc-950 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 hover:ring-zinc-300`}
						>
							Have us do the work
						</Link>
					</div>
					<p className="mt-5 text-sm text-zinc-500">
						Tracker plans from ${CLOUD_ENTRY_PRICE_USD} a month.{" "}
						<Link to="/pricing" className={`${QUIET} whitespace-nowrap`}>
							See pricing
						</Link>
						<span aria-hidden="true" className="mx-2 text-zinc-300 max-sm:hidden">
							·
						</span>
						<br className="sm:hidden" />
						<a
							href={demoUrl}
							target="_blank"
							rel={externalRel(demoUrl)}
							className={`${QUIET} inline-flex items-center gap-1 max-sm:mt-2`}
						>
							Try the live demo
							<ArrowUpRight className="size-3.5" aria-hidden="true" />
						</a>
					</p>
				</div>

				<div className="mt-16 md:mt-20">
					<ProductDemo />
				</div>
			</div>
		</section>
	);
}
