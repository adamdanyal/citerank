import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import type { ReactNode } from "react";
import { EngineIcon } from "@/components/home/engines";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH, engineOf, PREVIEW, percent } from "../product/data";
import { Mark } from "../product/parts";
import { ACTION, ACTION_QUIET, BODY, PANEL_PAD_WIDE, Page, PanelHead, SMALL, SUBHEAD } from "./kit";

/* The pictures use the demo's own sample: the question it asked, the brands the answer named, and how they rank. */
const ANSWER = PREVIEW.responses[0];
const NAMED = ANSWER?.brands.slice(0, 3) ?? [];
const ASKED = ANSWER ? engineOf(ANSWER.model) : null;
const BOARD = PREVIEW.leaderboard.slice(0, 3);
const LEADER = BOARD[0]?.share || 1;
const FIXES = ["Write this page", "Update that one", "Get listed on this review site"];

const LINE = "text-[1.0625rem] leading-snug font-medium";

/* Someone asks, and the AI names three brands. */
function Asked() {
	if (!ANSWER || !ASKED) return null;
	return (
		<div className="space-y-3">
			<p className={`${LINE} ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-sm bg-paper-2 px-4 py-3 text-ink`}>
				{ANSWER.prompt}
			</p>
			<div className="w-fit max-w-[88%] rounded-2xl rounded-bl-sm bg-ink px-4 py-3.5 text-paper">
				<p className={`${SMALL} flex items-center gap-2 text-zinc-300`}>
					<EngineIcon iconId={ASKED.iconId} className="size-4" />
					{ASKED.label}
				</p>
				<ol className="mt-3 space-y-2">
					{NAMED.map((brand) => (
						<li key={brand.name} className={`${LINE} flex items-center gap-2.5`}>
							<span className="w-3 text-zinc-400">{brand.rank}</span>
							<Mark name={brand.name} className="size-6" />
							{brand.name}
						</li>
					))}
				</ol>
			</div>
		</div>
	);
}

/* Who gets named most, with your brand marked. */
function Standing() {
	return (
		<ol className="space-y-4">
			{BOARD.map((entry, index) => {
				const you = entry.name === PREVIEW.brand;
				return (
					<li key={entry.name} className="grid grid-cols-[0.75rem_auto_minmax(0,1fr)_auto] items-center gap-x-3">
						<span className={`${LINE} text-zinc-500`}>{index + 1}</span>
						<Mark name={entry.name} className="size-8" />
						<span className="min-w-0">
							<span className={`${LINE} flex items-center gap-2 text-ink`}>
								{entry.name}
								{you ? (
									<span className="rounded-full bg-rust px-2 py-0.5 text-xs font-medium text-paper">You</span>
								) : null}
							</span>
							<span className="mt-2 block h-2 rounded-full bg-paper-2">
								<span
									className={`block h-full rounded-full ${you ? "bg-rust" : "bg-zinc-400"}`}
									style={{ width: `${Math.round((entry.share / LEADER) * 100)}%` }}
								/>
							</span>
						</span>
						<span className={`${LINE} font-mono text-ink`}>{percent(entry.share)}</span>
					</li>
				);
			})}
		</ol>
	);
}

/* A to-do list with the first job ticked off. */
function Fixes() {
	return (
		<ul className="space-y-3">
			{FIXES.map((fix, index) => (
				<li key={fix} className={`${LINE} flex items-center gap-3 rounded-xl px-4 py-3 text-ink ring-1 ring-zinc-200`}>
					<span
						className={`grid size-6 shrink-0 place-items-center rounded-md ${index === 0 ? "bg-rust text-paper" : "ring-1 ring-inset ring-zinc-300"}`}
					>
						{index === 0 ? (
							<svg aria-hidden="true" viewBox="0 0 12 12" className="size-3.5">
								<path
									d="M2 6.5l2.5 2.5 5.5-6"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						) : null}
					</span>
					<span className={index === 0 ? "text-zinc-500 line-through decoration-zinc-400" : ""}>{fix}</span>
				</li>
			))}
		</ul>
	);
}

const STEPS: { title: string; body: string; picture: ReactNode; shows: string }[] = [
	{
		title: "We ask AI your buyers’ questions",
		body: "We put your buyers’ questions to every engine and keep each answer whole, with the brands it named and the sources it cited.",
		picture: <Asked />,
		shows: "A buyer’s question, and an AI answer that names three brands in order",
	},
	{
		title: "See where you stand",
		body: "How often you are named, how often each rival is, how AI describes you, and which pages it trusts.",
		picture: <Standing />,
		shows: "A ranking of three brands by how often AI names them, with yours first",
	},
	{
		title: "Know what to fix",
		body: "Opportunities ranks the fixes, biggest win first: a page to write, a page to update, a review site to get on.",
		picture: <Fixes />,
		shows: "A to-do list of three fixes with the first one done",
	},
];

/*
 * Three steps a child could follow. Each is one picture and one line: a
 * question and its answer, a ranking, a to-do list. The product itself is in
 * the hero above; here the job is only to say what it does.
 */
export function HowItWorks() {
	const demoUrl = demoSiteUrl("marketing-page-cta", DEMO_BRAND_PATH);
	return (
		<section id="how-it-works" className={`relative bg-white ${PANEL_PAD_WIDE}`}>
			<Page>
				<PanelHead title="How CiteRank.com works" />

				<ol className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-8">
					{STEPS.map((step, index) => (
						<li
							key={step.title}
							className="flex min-w-0 flex-col rounded-card bg-white p-6 shadow-lift ring-1 ring-zinc-200 sm:p-8"
						>
							<div role="img" aria-label={step.shows} data-nosnippet className="flex min-h-60 flex-col justify-center">
								{step.picture}
							</div>
							<h3 className={`${SUBHEAD} mt-8 flex items-start gap-3 text-ink`}>
								<span
									aria-hidden="true"
									className="grid size-8 shrink-0 place-items-center rounded-full bg-rust font-sans text-[1rem] leading-none font-medium tracking-normal text-paper"
								>
									{index + 1}
								</span>
								{step.title}
							</h3>
							<p className={`${BODY} mt-3 text-zinc-600`}>{step.body}</p>
						</li>
					))}
				</ol>

				<div className="mt-10 flex flex-col gap-3 sm:flex-row lg:mt-12">
					<a
						href={cloudSignupUrl("marketing-cta")}
						onClick={() => trackEvent("signup_click", { from: "marketing-how-it-works" })}
						className={ACTION}
					>
						Start tracking
					</a>
					<a
						href={demoUrl}
						target="_blank"
						rel={externalRel(demoUrl)}
						onClick={() => trackEvent("demo_open", { from: "demo-section" })}
						className={ACTION_QUIET}
					>
						Try the live demo
					</a>
				</div>
			</Page>
		</section>
	);
}
