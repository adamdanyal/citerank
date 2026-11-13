import { INCLUDED } from "./included";
import { BODY, PANEL, PANEL_PAD, Page, PanelHead, SUBHEAD } from "./kit";

/* The hero names these; here each one gets its line, before a visitor reaches a price. */
export function Includes() {
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<PanelHead label="What you get" title="What every plan includes" className="max-w-[46rem]" />
				<ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
					{INCLUDED.map((item) => (
						<li key={item.title} className="rounded-2xl bg-paper-2 p-6 ring-1 ring-zinc-200">
							<h3 className={`${SUBHEAD} text-ink`}>{item.title}</h3>
							<p className={`${BODY} mt-2 text-zinc-600`}>{item.body}</p>
						</li>
					))}
				</ul>
			</Page>
		</section>
	);
}
