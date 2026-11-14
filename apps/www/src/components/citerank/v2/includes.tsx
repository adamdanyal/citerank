import { getModelMeta } from "@workspace/config/models";
import {
	CLOUD_ENTRY_PRICE_USD,
	CLOUD_PLATFORMS,
	PLANS,
	PREMIUM_MODELS,
	premiumPlanNames,
	STANDARD_PLATFORM_MENU,
} from "@workspace/config/plans";
import type { ReactNode } from "react";
import { EngineIcon } from "@/components/home/engines";
import { INCLUDED } from "./included";
import { BODY, LEAD, PANEL, PANEL_PAD, Page, PanelHead, SMALL, SUBHEAD } from "./kit";

const list = new Intl.ListFormat("en", { type: "conjunction" });

/** Gemini shares Google's mark in the catalog, which would make it indistinguishable from AI Overviews here. */
const ICON_OVERRIDES: Record<string, string> = { gemini: "gemini" };

const MODELS = Object.keys(CLOUD_PLATFORMS);
const SCRAPED = MODELS.filter((model) => CLOUD_PLATFORMS[model].access === "scraped");
const BY_API = MODELS.filter((model) => CLOUD_PLATFORMS[model].access !== "scraped");
const GROUNDED_ONLY = PREMIUM_MODELS.filter((model) => !STANDARD_PLATFORM_MENU.includes(model));
const RUNS_PER_DAY = Math.max(...Object.values(PLANS).map((plan) => plan.standardRunsPerDay));
const TIMES = ["", "once", "twice", "three times", "four times"][RUNS_PER_DAY] ?? `${RUNS_PER_DAY} times`;
const BASIC_ANSWERS_PER_DAY = PLANS.basic.maxPrompts * PLANS.basic.platformPicks * PLANS.basic.standardRunsPerDay;

const label = (model: string) => getModelMeta(model).label;
const iconId = (model: string) => ICON_OVERRIDES[model] ?? getModelMeta(model).iconId;

const [WHOLE_ANSWER, , TO_DO_LIST, SEATS_AND_API, CANCEL] = INCLUDED;

function Engines({ title, models }: { title: string; models: string[] }) {
	return (
		<div>
			<dt className={`${SMALL} text-zinc-400`}>{title}</dt>
			<dd className="mt-3">
				<ul className={models.length > 6 ? "grid grid-cols-2 gap-2 sm:grid-cols-4" : "flex flex-wrap gap-2"}>
					{models.map((model) => (
						<li
							key={model}
							className="inline-flex w-fit items-center gap-2 rounded-full bg-ink-well px-3.5 py-2 text-[0.9375rem] font-medium whitespace-nowrap text-paper"
						>
							<EngineIcon iconId={iconId(model)} className="size-4 shrink-0" />
							{label(model)}
						</li>
					))}
				</ul>
			</dd>
		</div>
	);
}

function Tile({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
	return (
		<li className={`flex min-w-0 flex-col rounded-card bg-paper-2 p-6 sm:p-8 ${className}`}>
			<h3 className={`${SUBHEAD} max-w-[18ch] text-ink`}>{title}</h3>
			<div className={`${BODY} mt-3 max-w-[44ch] text-zinc-600`}>{children}</div>
		</li>
	);
}

/*
 * What the money buys. The lead tile is the coverage, because it is the first
 * thing a buyer checks: which AI apps, and how often. The rest are the promises
 * that hold on every plan.
 */
export function Includes() {
	return (
		<section id="includes" className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<PanelHead title="What every plan includes">
					<p className={`${LEAD} text-zinc-600`}>
						On every plan, from ${CLOUD_ENTRY_PRICE_USD} a month up. Nothing here is an add-on.
					</p>
				</PanelHead>

				<ul className="mt-10 grid gap-4 lg:mt-16 lg:grid-cols-12 lg:gap-8">
					<li className="flex min-w-0 flex-col rounded-card bg-ink p-6 text-paper sm:p-8 lg:col-span-8 lg:row-span-3 lg:p-10">
						<h3 className="font-heading text-paper [overflow-wrap:break-word] min-w-0">
							<span className="block text-[clamp(6rem,11vw,10rem)] leading-[0.85] font-bold tracking-[-0.05em] tabular-nums">
								{MODELS.length}
							</span>
							<span className={`${SUBHEAD} mt-5 block`}>AI apps, asked {TIMES} a day</span>
						</h3>
						<p className={`${BODY} mt-3 max-w-[52ch] text-zinc-300`}>
							Your customers’ questions go to every one of them, so you can tell whether you are being named more often
							or less. On the entry plan that is up to {BASIC_ANSWERS_PER_DAY.toLocaleString("en-US")} answers a day.
						</p>
						<dl className="mt-8 grid gap-6 border-t border-ink-rule pt-8">
							<Engines title="Read in the app, the way your customers see it" models={SCRAPED} />
							<Engines title="Read through each company’s API" models={BY_API} />
						</dl>
						<p className={`${SMALL} mt-6 max-w-[60ch] text-zinc-400`}>
							{list.format(GROUNDED_ONLY.map(label))} answer with their own web search on, included on{" "}
							{premiumPlanNames()}.
						</p>
					</li>

					<Tile title={WHOLE_ANSWER.title} className="lg:col-span-4">
						{WHOLE_ANSWER.body}
					</Tile>
					<Tile title={TO_DO_LIST.title} className="lg:col-span-4">
						{TO_DO_LIST.body}
					</Tile>
					<Tile title={CANCEL.title} className="lg:col-span-4">
						{CANCEL.body}
					</Tile>

					<li className="grid min-w-0 gap-6 rounded-card bg-paper-2 p-6 sm:p-8 lg:col-span-12 lg:grid-cols-12 lg:items-center lg:gap-8 lg:p-10">
						<div className="min-w-0 lg:col-span-5">
							<h3 className={`${SUBHEAD} max-w-[22ch] text-ink`}>{SEATS_AND_API.title}</h3>
							<p className={`${BODY} mt-3 max-w-[44ch] text-zinc-600`}>{SEATS_AND_API.body}</p>
						</div>
						<pre className="min-w-0 overflow-x-auto rounded-lg bg-ink p-5 font-mono text-[0.8125rem] leading-[1.9] text-paper lg:col-span-7">
							<code>
								<span className="text-zinc-400 select-none">$ </span>claude mcp add --transport http citerank \{"\n"}
								{"    "}
								<span className="text-blue-300">https://app.citerank.com/api/mcp</span>
								{"\n"}
								<span className="text-zinc-400 select-none">$ </span>curl{" "}
								<span className="text-blue-300">https://app.citerank.com/api/v1/brands</span> \{"\n"}
								{"    "}-H <span className="text-blue-200">&quot;Authorization: Bearer $CITERANK_API_KEY&quot;</span>
							</code>
						</pre>
					</li>
				</ul>
			</Page>
		</section>
	);
}
