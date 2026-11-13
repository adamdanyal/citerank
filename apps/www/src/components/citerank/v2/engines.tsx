import { getModelMeta } from "@workspace/config/models";
import { CLOUD_PLATFORMS, PREMIUM_MODELS, premiumPlanNames, STANDARD_PLATFORM_MENU } from "@workspace/config/plans";
import { BODY, HEADING, MONO, Page, SECTION, SMALL } from "./kit";

const list = new Intl.ListFormat("en", { type: "conjunction" });

const MODELS = Object.keys(CLOUD_PLATFORMS);
const SCRAPED = MODELS.filter((model) => CLOUD_PLATFORMS[model].access === "scraped");
const BY_API = MODELS.filter((model) => CLOUD_PLATFORMS[model].access !== "scraped");
const GROUNDED_ONLY = PREMIUM_MODELS.filter((model) => !STANDARD_PLATFORM_MENU.includes(model));

const label = (model: string) => getModelMeta(model).label;

function Column({ title, models }: { title: string; models: string[] }) {
	return (
		<div>
			<p className={MONO}>{title}</p>
			<ul className="mt-4 border-t border-zinc-200">
				{models.map((model) => (
					<li key={model} className={`${BODY} border-b border-zinc-200 py-3 text-ink`}>
						{label(model)}
					</li>
				))}
			</ul>
		</div>
	);
}

export function Engines() {
	return (
		<section className={`${SECTION} bg-white`}>
			<Page className="grid gap-12 lg:grid-cols-12 lg:gap-16">
				<div className="lg:col-span-5">
					<h2 className={`${HEADING} text-ink`}>{MODELS.length} answer engines your buyers use</h2>
					<p className={`${BODY} mt-6 max-w-[44ch] text-zinc-600`}>
						{list.format(SCRAPED.map(label))} are checked the way a real user sees them. The rest we read through each
						company's API.
					</p>
					<p className={`${SMALL} mt-4 max-w-[44ch] text-zinc-500`}>
						{list.format(GROUNDED_ONLY.map(label))} answer with their own web search on, included on{" "}
						{premiumPlanNames()}.
					</p>
				</div>
				<div className="grid gap-10 sm:grid-cols-2 lg:col-span-7">
					<Column title="Read in the app" models={SCRAPED} />
					<Column title="Read through the API" models={BY_API} />
				</div>
			</Page>
		</section>
	);
}
