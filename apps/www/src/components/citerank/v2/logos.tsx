import { CUSTOMERS } from "@/components/home/logos";
import { PANEL, PANEL_PAD_TIGHT, Page, SMALL } from "./kit";

/* Social proof straight under the hero, where a visitor is still deciding whether to read on. */
export function Logos() {
	return (
		<section aria-labelledby="customers" className={`${PANEL} ${PANEL_PAD_TIGHT}`}>
			<Page className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
				<h2 id="customers" className={`${SMALL} shrink-0 text-center text-zinc-500 lg:max-w-[16rem] lg:text-left`}>
					Built on an open-source platform trusted by 200+ brands
				</h2>
				<ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 lg:flex-1 lg:justify-between lg:gap-x-8">
					{CUSTOMERS.map((customer) => (
						<li key={customer.name} className="flex h-6 items-center">
							<span role="img" aria-label={customer.name} className={customer.linkClass}>
								{customer.render()}
							</span>
						</li>
					))}
				</ul>
			</Page>
		</section>
	);
}
