import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { INCLUDED } from "./included";
import { LEAD, PANEL, PANEL_PAD, Page, PanelHead, RuledRow } from "./kit";

/* What the money buys, each with its line. The hero names the coverage and the price; this names the rest. */
export function Includes() {
	return (
		<section id="includes" className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<PanelHead title="What every plan includes" className="max-w-[46rem]">
					<p className={`${LEAD} text-zinc-600`}>
						On every plan, from ${CLOUD_ENTRY_PRICE_USD} a month up. Nothing here is an add-on.
					</p>
				</PanelHead>
				<ul className="mt-12 border-b border-zinc-200">
					{INCLUDED.map((item) => (
						<RuledRow key={item.title} title={item.title}>
							{item.body}
						</RuledRow>
					))}
				</ul>
			</Page>
		</section>
	);
}
