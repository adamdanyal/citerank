import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH, engineOf, PREVIEW, percent } from "../product/data";
import { Mark } from "../product/parts";
import { AppLogo, appIconId } from "../v2/app-logo";
import {
	ACTION,
	ACTION_QUIET,
	BODY,
	CARD,
	HEAD_GAP,
	Page,
	Pen,
	SECTION,
	SectionHead,
	StepNumber,
	TEXT,
	TEXT_2,
	TEXT_3,
	TITLE,
} from "./kit";

/* The pictures use the demo's own sample: the question it asked, the brands the answer named, and how they rank. */
const ANSWER = PREVIEW.responses[0];
const NAMED = ANSWER?.brands.slice(0, 3) ?? [];
const ASKED = ANSWER ? engineOf(ANSWER.model) : null;
const BOARD = PREVIEW.leaderboard.slice(0, 3);
const LEADER = BOARD[0]?.share || 1;
const FIXES = ["Write this page", "Update that one", "Get listed on this review site"];

const LINE = "text-[1.0625rem] leading-snug font-medium";

/* Someone asks, and the AI names three brands: yours is the one circled. */
function Asked() {
	if (!ANSWER || !ASKED) return null;
	return (
		<div className="mx-auto w-full max-w-[30rem] space-y-4">
			<p
				className={`${LINE} ml-auto w-fit max-w-[90%] rounded-[12px] rounded-br-[4px] bg-(--v3-ink) px-4 py-3 font-normal text-(--v3-on-ink)`}
			>
				{ANSWER.prompt}
			</p>
			<div className="w-full max-w-[20rem] rounded-[12px] rounded-bl-[4px] bg-(--v3-card) p-6 shadow-(--v3-shadow-sm) ring-1 ring-(--v3-line)">
				<p className={`flex items-center gap-2 text-sm ${TEXT_2}`}>
					<AppLogo id={appIconId(ASKED.model)} className="size-4" />
					{ASKED.label}
				</p>
				<ol className="mt-4 space-y-4">
					{NAMED.map((brand) => (
						<li key={brand.name} className={`flex items-center gap-3 text-[1.25rem] leading-snug font-medium ${TEXT}`}>
							<span className={`w-3 font-mono text-sm font-normal ${TEXT_3}`}>{brand.rank}</span>
							<Mark name={brand.name} className="size-8" />
							{brand.name === PREVIEW.brand ? <Pen className="ml-1">{brand.name}</Pen> : brand.name}
						</li>
					))}
				</ol>
			</div>
		</div>
	);
}

/* Who gets named most, with your brand circled and its bar in your colour. */
function Standing() {
	return (
		<ol className="w-full space-y-5">
			{BOARD.map((entry, index) => {
				const you = entry.name === PREVIEW.brand;
				return (
					<li key={entry.name} className="grid grid-cols-[0.75rem_auto_minmax(0,1fr)_auto] items-center gap-x-3">
						<span className={`font-mono text-sm ${TEXT_2}`}>{index + 1}</span>
						<Mark name={entry.name} className="size-8" />
						<span className="min-w-0">
							<span className={`${LINE} flex items-center gap-3 ${TEXT}`}>
								{you ? <Pen>{entry.name}</Pen> : entry.name}
								{you ? <span className={`text-sm font-normal ${TEXT_2}`}>You</span> : null}
							</span>
							<span className="mt-3 block h-1.5 rounded-full bg-(--v3-raised)">
								<span
									className={`block h-full rounded-full ${you ? "bg-(--v3-rust)" : "bg-(--v3-series-3)"}`}
									style={{ width: `${Math.round((entry.share / LEADER) * 100)}%` }}
								/>
							</span>
						</span>
						<span className={`${LINE} font-mono font-normal ${TEXT}`}>{percent(entry.share)}</span>
					</li>
				);
			})}
		</ol>
	);
}

/* A to-do list with the first job ticked off. */
function Fixes() {
	return (
		<ul className="w-full rounded-[8px] bg-(--v3-card) px-4 shadow-(--v3-shadow-sm) ring-1 ring-(--v3-line)">
			{FIXES.map((fix, index) => (
				<li
					key={fix}
					className={`${LINE} flex items-center gap-3 border-t border-(--v3-line) py-3.5 font-normal first:border-t-0 ${TEXT}`}
				>
					<span className="grid size-5 shrink-0 place-items-center rounded-[4px] ring-1 ring-(--v3-line-strong) ring-inset">
						{index === 0 ? <Check aria-hidden="true" strokeWidth={1.5} className={`size-4 ${TEXT_2}`} /> : null}
					</span>
					<span className={index === 0 ? `${TEXT_3} line-through decoration-(--v3-text-3)` : ""}>{fix}</span>
				</li>
			))}
		</ul>
	);
}

const STEPS: { title: string; body: string; picture: ReactNode; shows: string }[] = [
	{
		title: "We ask AI like a buyer",
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

function StepText({ index, title, body }: { index: number; title: string; body: string }) {
	return (
		<div className="min-w-0 p-4">
			<h3 className={`${TITLE} flex items-start gap-3 ${TEXT}`}>
				<StepNumber step={index + 1} />
				<span className="pt-px">{title}</span>
			</h3>
			<p className={`${BODY} mt-3 max-w-[44ch] ${TEXT_2}`}>{body}</p>
		</div>
	);
}

function Picture({ step }: { step: (typeof STEPS)[number] }) {
	return (
		<div role="img" aria-label={step.shows} data-nosnippet className="flex min-h-64 flex-col justify-center p-4">
			{step.picture}
		</div>
	);
}

/* Three steps a child could follow, side by side, each one line over one picture; the pictures share a row so they line up. */
export function HowItWorks() {
	const demoUrl = demoSiteUrl("marketing-page-cta", DEMO_BRAND_PATH);
	return (
		<section id="how-it-works" className={SECTION}>
			<Page>
				<SectionHead title="From your website to your fix list" />

				<ol className={`${HEAD_GAP} grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-3 lg:gap-6`}>
					{STEPS.map((step, index) => (
						<li
							key={step.title}
							className={`${CARD} flex min-w-0 flex-col gap-2 p-2 lg:row-span-2 lg:grid lg:grid-rows-subgrid`}
						>
							<StepText index={index} title={step.title} body={step.body} />
							<Picture step={step} />
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
