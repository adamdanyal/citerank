import { getModelMeta } from "@workspace/config/models";
import { CLOUD_PLATFORMS, PREMIUM_MODELS, premiumPlanNames, STANDARD_PLATFORM_MENU } from "@workspace/config/plans";
import { EngineIcon } from "@/components/home/engines";
import { BODY, LEAD, PANEL, PANEL_PAD, Page, PanelHead, PILL_QUIET, SMALL } from "./kit";

const list = new Intl.ListFormat("en", { type: "conjunction" });

/** Gemini shares Google's mark in the catalog, which would make it indistinguishable from AI Overviews here. */
const ICON_OVERRIDES: Record<string, string> = { gemini: "gemini" };

const MODELS = Object.keys(CLOUD_PLATFORMS);
const SCRAPED = MODELS.filter((model) => CLOUD_PLATFORMS[model].access === "scraped");
const BY_API = MODELS.filter((model) => CLOUD_PLATFORMS[model].access !== "scraped");
const GROUNDED_ONLY = PREMIUM_MODELS.filter((model) => !STANDARD_PLATFORM_MENU.includes(model));

const label = (model: string) => getModelMeta(model).label;
const iconId = (model: string) => ICON_OVERRIDES[model] ?? getModelMeta(model).iconId;

/** Each engine is a capsule carrying its own mark, so the lineup reads as faces rather than a list. */
function Chip({ model }: { model: string }) {
	return (
		<li className="inline-flex items-center gap-2.5 rounded-full bg-paper-2 py-1.5 pr-5 pl-1.5 ring-1 ring-zinc-200">
			<span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-zinc-200">
				<EngineIcon iconId={iconId(model)} className="size-4" />
			</span>
			<span className={`${BODY} font-medium text-ink`}>{label(model)}</span>
		</li>
	);
}

function Group({ title, models, note }: { title: string; models: string[]; note?: string }) {
	return (
		<div>
			<p>
				<span className={PILL_QUIET}>{title}</span>
			</p>
			<ul className="mt-5 flex flex-wrap gap-2.5">
				{models.map((model) => (
					<Chip key={model} model={model} />
				))}
			</ul>
			{note ? <p className={`${SMALL} mt-5 max-w-[52ch] text-zinc-500`}>{note}</p> : null}
		</div>
	);
}

export function Engines() {
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<PanelHead label="Coverage" title={`${MODELS.length} answer engines your buyers use`} className="max-w-[46rem]">
					<p className={`${LEAD} text-zinc-600`}>
						{list.format(SCRAPED.map(label))} are checked the way a real user sees them. The rest we read through each
						company's API.
					</p>
				</PanelHead>

				<div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
					<Group
						title="Read in the app"
						models={SCRAPED}
						note="Scraped from the real interface your customers see, not approximated through an API."
					/>
					<Group
						title="Read through the API"
						models={BY_API}
						note={`${list.format(GROUNDED_ONLY.map(label))} answer with their own web search on, included on ${premiumPlanNames()}.`}
					/>
				</div>
			</Page>
		</section>
	);
}
