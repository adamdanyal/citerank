import { INCLUDED } from "./included";
import { PANEL, PANEL_PAD, Page, PanelHead, RuledRow } from "./kit";

/* The hero names these; here each one gets its line, before a visitor reaches a price. */
export function Includes() {
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<PanelHead title="What every plan includes" className="max-w-[46rem]" />
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
