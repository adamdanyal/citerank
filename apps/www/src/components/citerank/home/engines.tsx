import { getModelMeta } from "@workspace/config/models";
import { CLOUD_PLATFORMS, PREMIUM_MODELS, premiumPlanNames, STANDARD_PLATFORM_MENU } from "@workspace/config/plans";
import { EngineIcon } from "@/components/home/engines";
import { CARD, Container, Reveal, RevealItem } from "../ui";

const list = new Intl.ListFormat("en", { type: "conjunction" });

/** Gemini shares Google's mark in the catalog, which would make it indistinguishable from AI Overviews here. */
const ICON_OVERRIDES: Record<string, string> = { gemini: "gemini" };

/** The tiles are too narrow for the catalog's full names, and Google is already the icon. */
const TILE_LABELS: Record<string, string> = {
	"google-ai-mode": "AI Mode",
	"google-ai-overview": "AI Overviews",
};

const ENGINES = Object.keys(CLOUD_PLATFORMS).map((model) => {
	const meta = getModelMeta(model);
	return { model, name: TILE_LABELS[model] ?? meta.label, iconId: ICON_OVERRIDES[model] ?? meta.iconId };
});

const SCRAPED = ENGINES.filter(({ model }) => CLOUD_PLATFORMS[model].access === "scraped");
const GROUNDED_ONLY = PREMIUM_MODELS.filter((model) => !STANDARD_PLATFORM_MENU.includes(model));

export function EngineCoverage() {
	return (
		<section className="bg-white">
			<Container className="grid gap-10 py-20 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-24">
				<Reveal className="lg:col-span-5">
					<h2 className="heading-2 text-zinc-950">{ENGINES.length} answer engines your buyers use</h2>
					<p className="body-7 mt-6 text-zinc-600">
						{list.format(SCRAPED.map((engine) => getModelMeta(engine.model).label))} are checked the way a real user
						sees them. The rest we read through each company's API.
					</p>
					<p className="body-7 mt-4 text-zinc-600">
						{list.format(GROUNDED_ONLY.map((model) => getModelMeta(model).label))} answer with their own web search on,
						included on {premiumPlanNames()}.
					</p>
				</Reveal>
				<ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-7" aria-label="AI engines CiteRank.com tracks">
					{ENGINES.map((engine, index) => (
						<RevealItem
							key={engine.name}
							delay={index * 40}
							className={`${CARD} flex items-center gap-3 py-3 pl-3 pr-4 title-4 text-zinc-900`}
						>
							<span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-paper-2">
								<EngineIcon iconId={engine.iconId} className="size-4" />
							</span>
							<span className="truncate">{engine.name}</span>
						</RevealItem>
					))}
				</ul>
			</Container>
		</section>
	);
}
