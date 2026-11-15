import { CLOUD_PLATFORMS, PLANS, premiumPlanNames, STANDARD_PLATFORM_MENU } from "@workspace/config/plans";
import { AppLogo, appIconId, appLabel } from "./app-logo";
import { INCLUDED } from "./included";
import { BODY, PANEL_PAD, Page, PanelHead, SMALL, SUBHEAD, Tick } from "./kit";

const MODELS = Object.keys(CLOUD_PLATFORMS);
const STANDARD = STANDARD_PLATFORM_MENU;
const PICKS = PLANS.basic.platformPicks;
/* The ten a brand picks from first, then the premium ones. */
const BOARD = [...STANDARD, ...MODELS.filter((model) => !STANDARD.includes(model))];

/*
 * What the money buys, as a list to tick off: five promises in their own
 * words, with nothing under them to read, and the AI apps as a wall of marks.
 * The longer explanation of each promise is on the pricing page.
 */
export function Includes() {
	return (
		<section id="includes" className={`relative bg-white ${PANEL_PAD}`}>
			<Page>
				<PanelHead title="What every plan includes" />

				<div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:mt-16 lg:grid-cols-12 lg:items-center lg:gap-x-16">
					<ul className="min-w-0 lg:col-span-6">
						{INCLUDED.map((promise) => (
							<li
								key={promise.title}
								className="flex items-start gap-4 border-t border-zinc-200 py-5 text-lead leading-snug font-medium text-ink first:border-t-0 first:pt-0 last:pb-0"
							>
								<Tick className="size-7" />
								{promise.title}
							</li>
						))}
					</ul>

					<div className="min-w-0 rounded-card bg-white p-6 shadow-lift ring-1 ring-zinc-200 sm:p-8 lg:col-span-6">
						<h3 className={`${SUBHEAD} text-ink`}>{MODELS.length} AI apps to choose from</h3>
						<p className={`${BODY} mt-2 text-zinc-600`}>
							Each brand tracks any {PICKS} of the {STANDARD.length} standard apps.
						</p>
						<ul className="mt-6 grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-5">
							{BOARD.map((model) => (
								<li
									key={model}
									className="flex flex-col items-center gap-2 text-center text-[0.875rem] leading-tight font-medium text-ink"
								>
									<span className="grid size-12 place-items-center rounded-2xl bg-paper-2">
										<AppLogo id={appIconId(model)} />
									</span>
									<span className="text-balance">{appLabel(model)}</span>
									{STANDARD.includes(model) ? null : (
										<span className="-mt-1 text-xs font-normal text-zinc-500">Premium</span>
									)}
								</li>
							))}
						</ul>
						<p className={`${SMALL} mt-6 text-zinc-600`}>Premium apps come with {premiumPlanNames()}.</p>
					</div>
				</div>
			</Page>
		</section>
	);
}
