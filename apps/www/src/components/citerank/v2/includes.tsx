import { getModelMeta } from "@workspace/config/models";
import { CLOUD_PLATFORMS, PLANS, premiumPlanNames, STANDARD_PLATFORM_MENU } from "@workspace/config/plans";
import { EngineIcon } from "@/components/home/engines";
import { isKind, PREVIEW } from "../product/data";
import { Chip, Mark, ToneWord } from "../product/parts";
import { INCLUDED } from "./included";
import {
	BODY,
	PANEL,
	PANEL_PAD,
	Page,
	PanelHead,
	SMALL,
	SUBHEAD,
	TILE_INK,
	TILE_RUST,
	TILE_SAND,
	TILE_TINT,
	TILE_WHITE,
} from "./kit";

/** Gemini shares Google's mark in the catalog, which would make it indistinguishable from AI Overviews here. */
const ICON_OVERRIDES: Record<string, string> = { gemini: "gemini" };

const MODELS = Object.keys(CLOUD_PLATFORMS);
const STANDARD = STANDARD_PLATFORM_MENU;
/* The ten a brand picks from first, then the ones sold only as premium. */
const PREMIUM_ONLY = MODELS.filter((model) => !STANDARD.includes(model));
const PICKS = PLANS.basic.platformPicks;
const RUNS_PER_DAY = PLANS.basic.standardRunsPerDay;
const [WHOLE_ANSWER, ASK_AGAIN, TO_DO_LIST, SEATS_AND_API, CANCEL] = INCLUDED;

const label = (model: string) => getModelMeta(model).label;
const iconId = (model: string) => ICON_OVERRIDES[model] ?? getModelMeta(model).iconId;

const KEY =
	"flex h-22 flex-col items-center justify-center gap-2 rounded-xl px-2 text-center text-[0.875rem] leading-tight font-medium text-balance lg:h-26";

/* The sample answer and the sample fixes the product screens show, so a tile's picture is the product's own. */
const NAMED = PREVIEW.responses[0]?.brands.slice(0, 3) ?? [];
const FIXES = PREVIEW.opportunities.items.slice(0, 3);

/*
 * What the money buys, as six tiles: one promise and one thing to look at in
 * each. The apps are a board of keys, how often we ask is a figure, and the
 * two promises about the product show a piece of it.
 */
export function Includes() {
	return (
		<section id="includes" className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<PanelHead title="What every plan includes" />

				<ul className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-4 lg:mt-16 lg:grid-cols-12 lg:gap-6">
					<li className={`${TILE_WHITE} lg:col-span-7 lg:row-span-2`}>
						<h3 className={SUBHEAD}>{MODELS.length} AI apps to choose from</h3>
						<p className={`${BODY} mt-2 text-zinc-700`}>
							Each brand tracks any {PICKS} of the {STANDARD.length} standard apps.
						</p>
						<ul className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-5">
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
					</li>

					<li className={`${TILE_RUST} lg:col-span-5`}>
						<p
							aria-hidden="true"
							className="font-heading text-[clamp(4.5rem,6vw+1.5rem,7.5rem)] leading-[0.85] font-bold tracking-[-0.04em]"
						>
							{RUNS_PER_DAY}×
						</p>
						<h3 className={`${SUBHEAD} mt-6`}>{ASK_AGAIN.title}</h3>
						<p className={`${BODY} mt-2`}>{ASK_AGAIN.body}</p>
					</li>

					<li className={`${TILE_INK} lg:col-span-5`}>
						<h3 className={SUBHEAD}>{SEATS_AND_API.title}</h3>
						<p className={`${BODY} mt-2 text-zinc-300`}>{SEATS_AND_API.body}</p>
					</li>

					<li className={`${TILE_SAND} lg:col-span-4`}>
						<h3 className={SUBHEAD}>{WHOLE_ANSWER.title}</h3>
						<p className={`${BODY} mt-2 text-zinc-700`}>{WHOLE_ANSWER.body}</p>
						<ul
							data-slot="answer-brands"
							data-kind="product"
							data-nosnippet
							aria-hidden="true"
							className="mt-6 flex flex-wrap gap-1.5 text-sm"
						>
							{NAMED.map((brand) => (
								<li key={brand.name}>
									<Chip className="bg-white">
										<Mark name={brand.name} className="size-4" />
										{brand.name}
										<span className="font-mono text-zinc-500">#{brand.rank}</span>
										{isKind(brand.sentiment) ? <ToneWord kind={brand.sentiment} /> : null}
									</Chip>
								</li>
							))}
						</ul>
					</li>

					<li className={`${TILE_TINT} lg:col-span-4`}>
						<h3 className={SUBHEAD}>{TO_DO_LIST.title}</h3>
						<p className={`${BODY} mt-2 text-zinc-700`}>{TO_DO_LIST.body}</p>
						<ol
							data-slot="fix-list"
							data-kind="product"
							data-nosnippet
							aria-hidden="true"
							className="mt-6 space-y-1.5 text-sm"
						>
							{FIXES.map((fix, index) => (
								<li key={fix.title} className="flex gap-3 rounded-lg bg-white px-3 py-2 ring-1 ring-zinc-200">
									<span className="font-mono text-zinc-500">{index + 1}</span>
									<span className="min-w-0 truncate text-ink">{fix.title}</span>
								</li>
							))}
						</ol>
					</li>

					<li className={`${TILE_SAND} lg:col-span-4`}>
						<h3 className={SUBHEAD}>{CANCEL.title}</h3>
						<p className={`${BODY} mt-2 text-zinc-700`}>{CANCEL.body}</p>
					</li>
				</ul>
			</Page>
		</section>
	);
}
