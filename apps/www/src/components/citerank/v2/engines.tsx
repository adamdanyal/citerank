import { getModelMeta } from "@workspace/config/models";
import { CLOUD_PLATFORMS, PREMIUM_MODELS, premiumPlanNames, STANDARD_PLATFORM_MENU } from "@workspace/config/plans";
import type { ReactNode } from "react";
import { EngineIcon } from "@/components/home/engines";
import { BODY, HEADING, MONO, Page, SECTION, SMALL } from "./kit";

const list = new Intl.ListFormat("en", { type: "conjunction" });

/** Gemini shares Google's mark in the catalog, which would make it indistinguishable from AI Overviews here. */
const ICON_OVERRIDES: Record<string, string> = { gemini: "gemini" };

const MODELS = Object.keys(CLOUD_PLATFORMS);
const SCRAPED = MODELS.filter((model) => CLOUD_PLATFORMS[model].access === "scraped");
const BY_API = MODELS.filter((model) => CLOUD_PLATFORMS[model].access !== "scraped");
const GROUNDED_ONLY = PREMIUM_MODELS.filter((model) => !STANDARD_PLATFORM_MENU.includes(model));

const label = (model: string) => getModelMeta(model).label;
const iconId = (model: string) => ICON_OVERRIDES[model] ?? getModelMeta(model).iconId;

function Column({ title, models, children }: { title: string; models: string[]; children?: ReactNode }) {
	return (
		<div className="flex flex-col">
			<p className={MONO}>{title}</p>
			<ul className="mt-4 border-t border-zinc-200">
				{models.map((model) => (
					<li key={model} className="flex items-center gap-3 border-b border-zinc-200 py-3">
						<span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-paper-2">
							<EngineIcon iconId={iconId(model)} className="size-4" />
						</span>
						<span className={`${BODY} text-ink`}>{label(model)}</span>
					</li>
				))}
			</ul>
			{children}
		</div>
	);
}

export function Engines() {
	return (
		<section className={`${SECTION} bg-white`}>
			<Page>
				<div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
					<h2 className={`${HEADING} text-ink lg:col-span-6`}>{MODELS.length} answer engines your buyers use</h2>
					<p className={`${BODY} max-w-[52ch] text-zinc-600 lg:col-span-6`}>
						{list.format(SCRAPED.map(label))} are checked the way a real user sees them. The rest we read through each
						company's API.
					</p>
				</div>

				<div className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-12">
					<Column title="Read in the app" models={SCRAPED}>
						<p className={`${SMALL} mt-6 max-w-[40ch] text-zinc-500`}>
							{list.format(GROUNDED_ONLY.map(label))} answer with their own web search on, included on{" "}
							{premiumPlanNames()}.
						</p>
					</Column>
					<Column title="Read through the API" models={BY_API} />
				</div>
			</Page>
		</section>
	);
}
