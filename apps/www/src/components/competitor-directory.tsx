import { Link } from "@tanstack/react-router";
import { cloudSignupUrl } from "@workspace/config/referrals";
import { Search, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { CATEGORY_LABELS, type CompetitorCategory, ENTRY_PRICE, isRetired, sortedCompetitors } from "@/lib/competitors";
import { trackEvent } from "@/lib/posthog";
import { ACTION, ACTION_QUIET, BODY, CARD, CARD_LIFT, LINK, PANEL, Page, SMALL } from "./citerank/v2/kit";
import { DirectoryHero, FOCUS } from "./directory-shell";
import { ToolGrid } from "./tool-list";

const FROM = "marketing-page-cta";
const SIGN_UP_URL = cloudSignupUrl(FROM);

const visibleCompetitors = sortedCompetitors.filter((c) => !isRetired(c) && c.category !== "other");
const categories = [...new Set(visibleCompetitors.map((c) => c.category))];

/* The list opens on the most popular tools. Every other row is in the page too, held back until asked for, so a phone is not handed two hundred rows to scroll. */
const FIRST = 20;

const CHIP = `h-11 rounded-[10px] px-4 text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-200 ${FOCUS}`;
const CHIP_ON = "bg-ink text-paper";
const CHIP_OFF = "bg-paper-2 text-zinc-700 hover:text-ink";

/*
 * One way to narrow the list at a time: a name typed in the box searches every
 * tool whatever category was picked, and picking a category clears the box.
 */
export function CompetitorDirectory() {
	const searchId = useId();
	const searchBox = useRef<HTMLInputElement>(null);
	const [category, setCategory] = useState<CompetitorCategory | "all">("all");
	const [query, setQuery] = useState("");
	const [showAll, setShowAll] = useState(false);

	const wanted = query.trim().toLowerCase();
	const tools = visibleCompetitors.filter((c) =>
		wanted ? c.name.toLowerCase().includes(wanted) : category === "all" || c.category === category,
	);
	const held = !wanted && !showAll && tools.length > FIRST;

	function pick(next: CompetitorCategory | "all") {
		setCategory(next);
		setQuery("");
		setShowAll(false);
	}

	return (
		<>
			<DirectoryHero
				title="AI visibility tools"
				lead="Every tool that tracks your brand in AI answers, in one list."
				aside={
					<div className={`${CARD_LIFT} p-6`}>
						<h2 className="text-[1rem] leading-[1.4] font-medium text-ink">Why consider CiteRank.com</h2>
						<p className={`${SMALL} mt-2 text-zinc-700`}>
							Hosted, self-serve, and transparent. Track AI visibility without a sales call or inflated pricing, from{" "}
							{ENTRY_PRICE}.
						</p>
						<div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
							<a href={SIGN_UP_URL} onClick={() => trackEvent("signup_click", { from: FROM })} className={ACTION}>
								Start tracking
							</a>
							<Link to="/agency" className={ACTION_QUIET}>
								Let us do the work
							</Link>
						</div>
					</div>
				}
			/>

			<section className={`${PANEL} pt-6 pb-9 sm:pt-8 sm:pb-12 lg:pb-18`}>
				<Page>
					<div className="flex flex-wrap items-end gap-x-6 gap-y-3">
						<div className="w-full max-w-sm">
							<label htmlFor={searchId} className={`${SMALL} font-medium text-ink`}>
								Find a tool
							</label>
							<div className="relative mt-2">
								<Search
									aria-hidden="true"
									className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-zinc-500"
								/>
								<input
									ref={searchBox}
									id={searchId}
									type="search"
									value={query}
									onChange={(event) => {
										setQuery(event.target.value);
										setCategory("all");
									}}
									autoComplete="off"
									spellCheck={false}
									className={`h-12 w-full rounded-[10px] bg-white pr-13 pl-12 text-[1rem] text-ink ring-1 ring-zinc-500 transition-colors duration-200 ring-inset hover:bg-paper-2 [&::-webkit-search-cancel-button]:appearance-none ${FOCUS}`}
								/>
								{query ? (
									<button
										type="button"
										aria-label="Clear the search"
										onClick={() => {
											pick("all");
											searchBox.current?.focus();
										}}
										className={`absolute top-1/2 right-1 grid size-11 -translate-y-1/2 place-items-center rounded-full text-zinc-600 transition-colors duration-200 hover:text-ink ${FOCUS}`}
									>
										<X aria-hidden="true" className="size-4" />
									</button>
								) : null}
							</div>
						</div>
						<h2 className={`${SMALL} pb-3.5 text-zinc-600 tabular-nums`}>
							{tools.length} {tools.length === 1 ? "tool" : "tools"}
						</h2>
					</div>
					<fieldset className="mt-5 flex flex-wrap gap-2">
						<legend className="sr-only">Category</legend>
						<button
							type="button"
							aria-pressed={category === "all"}
							onClick={() => pick("all")}
							className={`${CHIP} ${category === "all" ? CHIP_ON : CHIP_OFF}`}
						>
							All
						</button>
						{categories.map((cat) => (
							<button
								type="button"
								key={cat}
								aria-pressed={category === cat}
								onClick={() => pick(cat)}
								className={`${CHIP} ${category === cat ? CHIP_ON : CHIP_OFF}`}
							>
								{CATEGORY_LABELS[cat]}
							</button>
						))}
					</fieldset>

					<div className="mt-10">
						{tools.length > 0 ? (
							<ToolGrid
								competitors={tools}
								showCategory={category === "all"}
								visit={false}
								first={held ? FIRST : undefined}
							/>
						) : (
							<p className={`${CARD} ${BODY} text-zinc-700`}>
								No tool by that name.{" "}
								<button type="button" onClick={() => pick("all")} className={`${LINK} font-medium text-ink`}>
									See all {visibleCompetitors.length} tools
								</button>
							</p>
						)}
					</div>
					{held ? (
						<p className="mt-6" data-show-all>
							<button type="button" onClick={() => setShowAll(true)} className={`${ACTION_QUIET} max-sm:w-full`}>
								Show all {tools.length} tools
							</button>
						</p>
					) : null}
					{/* With scripting off the button cannot answer, so the held rows are simply shown. */}
					<noscript>
						<style>{"[data-held]{display:grid!important}[data-show-all]{display:none}"}</style>
					</noscript>
				</Page>
			</section>
		</>
	);
}
