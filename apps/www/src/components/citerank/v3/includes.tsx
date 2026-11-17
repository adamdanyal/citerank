import { CLOUD_PLATFORMS, PLANS, premiumPlanNames, STANDARD_PLATFORM_MENU } from "@workspace/config/plans";
import { AppLogo, appIconId, appLabel } from "../v2/app-logo";
import { INCLUDED } from "../v2/included";
import { BODY, CARD, CheckMark, HEAD_GAP, Page, SECTION, SectionHead, SMALL, TEXT, TEXT_2, TEXT_3, TITLE } from "./kit";

const MODELS = Object.keys(CLOUD_PLATFORMS);
const STANDARD = STANDARD_PLATFORM_MENU;
const PICKS = PLANS.basic.platformPicks;
/* The ten a brand picks from first, then the premium ones. */
const BOARD = [...STANDARD, ...MODELS.filter((model) => !STANDARD.includes(model))];

/* What the money buys, as a list to tick off, and the AI apps as a wall of their own logos. */
export function Includes() {
	return (
		<section id="includes" className={SECTION}>
			<Page>
				<SectionHead title="What every plan includes" />

				<div className={`${HEAD_GAP} grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-12 lg:items-start lg:gap-x-16`}>
					<ul className="min-w-0 lg:col-span-6">
						{INCLUDED.map((promise) => (
							<li
								key={promise.title}
								className={`flex items-center gap-3 border-t border-(--v3-line) py-4 text-[1.125rem] leading-snug first:border-t-0 first:pt-0 last:pb-0 ${TEXT}`}
							>
								<CheckMark />
								{promise.title}
							</li>
						))}
					</ul>

					<div className={`${CARD} min-w-0 p-6 lg:col-span-6`}>
						<h3 className={`${TITLE} ${TEXT}`}>{MODELS.length} AI tools to choose from</h3>
						<p className={`${BODY} mt-2 ${TEXT_2}`}>
							Each brand tracks any {PICKS} of the {STANDARD.length} standard tools
						</p>
						<ul className="mt-6 grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-5">
							{BOARD.map((model) => (
								<li
									key={model}
									className={`flex flex-col items-center gap-2 text-center text-[0.875rem] leading-tight ${TEXT}`}
								>
									<span className="grid size-12 place-items-center rounded-[10px] bg-(--v3-raised)">
										<AppLogo id={appIconId(model)} />
									</span>
									<span className="text-balance">{appLabel(model)}</span>
									{STANDARD.includes(model) ? null : <span className={`-mt-1 text-xs ${TEXT_3}`}>Premium</span>}
								</li>
							))}
						</ul>
						<p className={`${SMALL} mt-6 ${TEXT_2}`}>Premium tools come with {premiumPlanNames()}</p>
					</div>
				</div>
			</Page>
		</section>
	);
}
