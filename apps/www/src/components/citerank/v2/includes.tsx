import { getModelMeta } from "@workspace/config/models";
import { CLOUD_PLATFORMS, PLANS, premiumPlanNames, STANDARD_PLATFORM_MENU } from "@workspace/config/plans";
import { EngineIcon, GEMINI_PATH } from "@/components/home/engines";
import { INCLUDED } from "./included";
import { BODY, PANEL_PAD, Page, PanelHead, SMALL, SUBHEAD, Tick } from "./kit";

/** Gemini shares Google's mark in the catalog, which would make it indistinguishable from AI Overviews here. */
const ICON_OVERRIDES: Record<string, string> = { gemini: "gemini" };

const MODELS = Object.keys(CLOUD_PLATFORMS);
const STANDARD = STANDARD_PLATFORM_MENU;
const PICKS = PLANS.basic.platformPicks;
/* The ten a brand picks from first, then the premium ones. */
const BOARD = [...STANDARD, ...MODELS.filter((model) => !STANDARD.includes(model))];

const label = (model: string) => getModelMeta(model).label;
const iconId = (model: string) => ICON_OVERRIDES[model] ?? getModelMeta(model).iconId;

/* An app is known by its colour as much as its shape, so the board shows each logo in its own. The ones not listed are black in life too. */
const LOGO_COLOUR: Record<string, string> = {
	anthropic: "text-logo-claude",
	perplexity: "text-logo-perplexity",
	mistral: "text-logo-mistral",
	deepseek: "text-logo-deepseek",
	qwen: "text-logo-qwen",
	meta: "text-logo-meta",
};

function AppLogo({ id }: { id: string }) {
	if (id === "google") {
		return (
			<svg aria-hidden="true" viewBox="0 0 48 48" className="size-6">
				<path
					className="fill-logo-google-red"
					d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
				/>
				<path
					className="fill-logo-google-blue"
					d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
				/>
				<path
					className="fill-logo-google-yellow"
					d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
				/>
				<path
					className="fill-logo-google-green"
					d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
				/>
			</svg>
		);
	}
	if (id === "gemini") {
		return (
			<svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
				<defs>
					<linearGradient id="gemini-colours" x1="0" y1="1" x2="1" y2="0">
						<stop offset="0" className="[stop-color:var(--color-logo-gemini-1)]" />
						<stop offset="0.5" className="[stop-color:var(--color-logo-gemini-2)]" />
						<stop offset="1" className="[stop-color:var(--color-logo-gemini-3)]" />
					</linearGradient>
				</defs>
				<path fill="url(#gemini-colours)" d={GEMINI_PATH} />
			</svg>
		);
	}
	return <EngineIcon iconId={id} className={`size-6 ${LOGO_COLOUR[id] ?? "text-ink"}`} />;
}

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
										<AppLogo id={iconId(model)} />
									</span>
									<span className="text-balance">{label(model)}</span>
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
