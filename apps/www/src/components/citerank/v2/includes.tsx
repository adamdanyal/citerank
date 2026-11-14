import { getModelMeta } from "@workspace/config/models";
import {
	CLOUD_ENTRY_PRICE_USD,
	CLOUD_PLATFORMS,
	PLANS,
	PREMIUM_MODELS,
	premiumModelLabel,
	premiumPlanNames,
	STANDARD_PLATFORM_MENU,
} from "@workspace/config/plans";
import { cloudSignupUrl } from "@workspace/config/referrals";
import { type ReactNode, useState } from "react";
import { EngineIcon } from "@/components/home/engines";
import { trackEvent } from "@/lib/posthog";
import { INCLUDED } from "./included";
import { ACTION, BAND_PAD, BODY, PANEL_TINT, Page, PanelHead, SMALL, SUBHEAD } from "./kit";

/** Gemini shares Google's mark in the catalog, which would make it indistinguishable from AI Overviews here. */
const ICON_OVERRIDES: Record<string, string> = { gemini: "gemini" };

const MODELS = Object.keys(CLOUD_PLATFORMS);
/* The ten a brand picks from, by how we read them. */
const STANDARD = STANDARD_PLATFORM_MENU;
const IN_APP = STANDARD.filter((model) => CLOUD_PLATFORMS[model].access === "scraped");
const BY_API = STANDARD.filter((model) => CLOUD_PLATFORMS[model].access === "api");
const ENTRY = PLANS.basic;
const PICKS = ENTRY.platformPicks;
/* What a visitor finds picked, so the sum below is whole before they touch anything. */
const START = ["chatgpt", "google-ai-overview", "gemini", "claude"].filter((model) => STANDARD.includes(model));
const [WHOLE_ANSWER, , TO_DO_LIST, SEATS_AND_API, CANCEL] = INCLUDED;
const PROMISES = [WHOLE_ANSWER, TO_DO_LIST, SEATS_AND_API, CANCEL];

const label = (model: string) => getModelMeta(model).label;
const iconId = (model: string) => ICON_OVERRIDES[model] ?? getModelMeta(model).iconId;

/* A key on the board. A checkbox, since that is what picking several of a set is; the label is what a finger lands on. */
const KEY =
	"relative flex h-24 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl px-2 text-center text-[0.875rem] leading-tight font-medium text-balance transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rust";
const KEY_OFF = "bg-white text-ink ring-1 ring-inset ring-zinc-200 hover:ring-zinc-400";
const KEY_ON = "bg-ink text-paper";

function Keys({
	title,
	models,
	picked,
	onToggle,
}: {
	title: string;
	models: readonly string[];
	picked: string[];
	onToggle: (model: string) => void;
}) {
	return (
		<div className="mt-7">
			<p className={`${SMALL} text-zinc-600`}>{title}</p>
			<ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
				{models.map((model) => {
					const on = picked.includes(model);
					return (
						<li key={model}>
							<label className={`${KEY} ${on ? KEY_ON : KEY_OFF}`}>
								<input type="checkbox" checked={on} onChange={() => onToggle(model)} className="sr-only" />
								<EngineIcon iconId={iconId(model)} className="size-6 shrink-0" />
								{label(model)}
							</label>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function Figure({ value, unit, result = false }: { value: ReactNode; unit: string; result?: boolean }) {
	return (
		<span className="flex flex-col">
			<span
				className={`font-heading text-[clamp(2.75rem,3vw+1.5rem,4.25rem)] leading-none font-bold tracking-[-0.03em] ${result ? "text-rust" : "text-ink"}`}
			>
				{value}
			</span>
			<span className={`${SMALL} mt-2 text-zinc-600`}>{unit}</span>
		</span>
	);
}

function Sign({ children }: { children: string }) {
	return <span className="pb-11 font-heading text-[1.75rem] leading-none text-zinc-400">{children}</span>;
}

/*
 * What the money buys, as something to do rather than to read. A visitor picks
 * the apps as they will in the product, and the sum under the board turns the
 * plan's three limits into the one figure they are paying for. The promises
 * that hold on every plan stand beside it as the list they are.
 */
export function Includes() {
	const [picked, setPicked] = useState<string[]>(START);
	/* A fifth pick takes the place of the first, so no key is ever dead. */
	const toggle = (model: string) =>
		setPicked((now) => (now.includes(model) ? now.filter((item) => item !== model) : [...now, model].slice(-PICKS)));
	const answers = picked.length * ENTRY.maxPrompts * ENTRY.standardRunsPerDay;

	return (
		<section id="includes" className={`${PANEL_TINT} ${BAND_PAD}`}>
			<Page>
				<PanelHead title="What every plan includes" />

				<div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-14 lg:mt-16 lg:grid-cols-12 lg:gap-8">
					<div className="min-w-0 lg:col-span-7">
						<div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
							<h3 className={`${SUBHEAD} text-ink`}>{MODELS.length} AI apps to choose from</h3>
							<p aria-live="polite" className={`${SMALL} text-zinc-600 tabular-nums`}>
								{picked.length} of {PICKS} picked
							</p>
						</div>
						<p className={`${BODY} mt-2 text-zinc-600`}>
							Each brand tracks any {PICKS} of the {STANDARD.length} standard apps. Pick yours.
						</p>

						<fieldset className="min-w-0">
							<legend className="sr-only">
								Pick any {PICKS} of the {STANDARD.length} standard AI apps
							</legend>
							<Keys
								title="Standard, read in the app the way your customers see it"
								models={IN_APP}
								picked={picked}
								onToggle={toggle}
							/>
							<Keys
								title="Standard, read through each company’s API"
								models={BY_API}
								picked={picked}
								onToggle={toggle}
							/>
						</fieldset>

						<div className="mt-7">
							<p className={`${SMALL} text-zinc-600`}>
								Premium, asked with their own web search on ({premiumPlanNames()})
							</p>
							<ul className="mt-3 flex flex-wrap gap-2">
								{PREMIUM_MODELS.map((model) => (
									<li
										key={model}
										className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.875rem] font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300"
									>
										<EngineIcon iconId={iconId(model)} className="size-4 shrink-0" />
										{premiumModelLabel(model)}
									</li>
								))}
							</ul>
						</div>

						<div className="mt-10 flex flex-wrap items-center justify-between gap-x-10 gap-y-8 border-t border-zinc-300 pt-8">
							<p
								role="img"
								aria-label={`${picked.length} AI apps, times ${ENTRY.maxPrompts} buyer questions, times ${ENTRY.standardRunsPerDay} times a day, is ${answers.toLocaleString("en-US")} answers a day`}
								className="flex flex-wrap items-end gap-x-5 gap-y-6"
							>
								<Figure value={picked.length} unit="AI apps" />
								<Sign>×</Sign>
								<Figure value={ENTRY.maxPrompts} unit="buyer questions" />
								<Sign>×</Sign>
								<Figure value={ENTRY.standardRunsPerDay} unit="times a day" />
								<Sign>=</Sign>
								<Figure value={answers.toLocaleString("en-US")} unit="answers a day" result />
							</p>
							<a
								href={cloudSignupUrl("marketing-cta")}
								onClick={() => trackEvent("signup_click", { from: "marketing-includes" })}
								className={ACTION}
							>
								Start tracking
							</a>
						</div>
						<p className={`${SMALL} mt-5 text-zinc-600`}>
							The most the {ENTRY.name} plan tracks, at ${CLOUD_ENTRY_PRICE_USD} a month.
						</p>
					</div>

					<ul className="min-w-0 lg:col-span-5 lg:pl-8">
						{PROMISES.map((promise) => (
							<li
								key={promise.title}
								className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 border-t border-zinc-300 py-7 first:border-t-0 first:pt-0 last:pb-0"
							>
								<svg aria-hidden="true" viewBox="0 0 20 20" className="mt-1.5 size-5 text-rust">
									<path
										d="M4 10.5l4 4 8-9"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.25"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<div>
									<h3 className={`${SUBHEAD} text-ink`}>{promise.title}</h3>
									<p className={`${BODY} mt-2 text-zinc-600`}>{promise.body}</p>
								</div>
							</li>
						))}
					</ul>
				</div>
			</Page>
		</section>
	);
}
