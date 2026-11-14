import { getModelMeta } from "@workspace/config/models";
import { CLOUD_PLATFORMS, PLANS, premiumPlanNames, STANDARD_PLATFORM_MENU } from "@workspace/config/plans";
import { EngineIcon } from "@/components/home/engines";
import { INCLUDED } from "./included";
import { BAND_PAD, BODY, PANEL_TINT, Page, PanelHead, SMALL, SUBHEAD } from "./kit";

/** Gemini shares Google's mark in the catalog, which would make it indistinguishable from AI Overviews here. */
const ICON_OVERRIDES: Record<string, string> = { gemini: "gemini" };

const MODELS = Object.keys(CLOUD_PLATFORMS);
const STANDARD = STANDARD_PLATFORM_MENU;
/* The ten a brand picks from first, then the ones sold only as premium. */
const PREMIUM_ONLY = MODELS.filter((model) => !STANDARD.includes(model));
const PICKS = PLANS.basic.platformPicks;
const RUNS_PER_DAY = PLANS.basic.standardRunsPerDay;
const [WHOLE_ANSWER, ASK_AGAIN, TO_DO_LIST, SEATS_AND_API, CANCEL] = INCLUDED;
const PROMISES = [WHOLE_ANSWER, TO_DO_LIST, SEATS_AND_API, CANCEL];

const label = (model: string) => getModelMeta(model).label;
const iconId = (model: string) => ICON_OVERRIDES[model] ?? getModelMeta(model).iconId;

const KEY =
	"flex h-22 flex-col items-center justify-center gap-2 rounded-xl px-2 text-center text-[0.875rem] leading-tight font-medium text-balance";

/*
 * What the money buys, at a glance: every AI app as a key on one board,
 * and beside it the promises that hold on every plan, each with its tick.
 * Nothing here is a control. It is a list a buyer can take in without reading.
 */
export function Includes() {
	return (
		<section id="includes" className={`${PANEL_TINT} ${BAND_PAD}`}>
			<Page>
				<PanelHead title="What every plan includes" />

				<div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-x-16">
					<div className="min-w-0 rounded-card bg-white p-6 text-ink ring-1 ring-zinc-200 sm:p-8 lg:col-span-7">
						<h3 className={SUBHEAD}>{MODELS.length} AI apps to choose from</h3>
						<p className={`${BODY} mt-2 text-zinc-600`}>
							Each brand tracks any {PICKS} of the {STANDARD.length} standard apps.
						</p>
						<ul className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5">
							{STANDARD.map((model) => (
								<li key={model} className={`${KEY} bg-paper-2`}>
									<EngineIcon iconId={iconId(model)} className="size-6 shrink-0" />
									{label(model)}
								</li>
							))}
							{PREMIUM_ONLY.map((model) => (
								<li key={model} className={`${KEY} ring-1 ring-inset ring-zinc-300`}>
									<EngineIcon iconId={iconId(model)} className="size-6 shrink-0" />
									{label(model)}
								</li>
							))}
							<li className={`${SMALL} col-span-3 flex items-center text-zinc-600 sm:col-span-2 sm:px-3`}>
								The outlined ones are premium apps, on {premiumPlanNames()}.
							</li>
						</ul>
						<div className="mt-8 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-6 border-t border-zinc-200 pt-8">
							<p
								aria-hidden="true"
								className="font-heading text-[clamp(3rem,3vw+1.5rem,4.25rem)] leading-none font-bold tracking-[-0.03em] text-rust"
							>
								{RUNS_PER_DAY}×
							</p>
							<div>
								<h3 className={SUBHEAD}>{ASK_AGAIN.title}</h3>
								<p className={`${BODY} mt-2 text-zinc-600`}>{ASK_AGAIN.body}</p>
							</div>
						</div>
					</div>

					<ul className="min-w-0 lg:col-span-5 lg:self-center">
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
