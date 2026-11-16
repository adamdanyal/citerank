import { CUSTOMERS } from "@/components/home/logos";
import { Page } from "./kit";

/* Who already relies on it, straight under the hero, where a visitor is still deciding whether to read on. */
export function Logos() {
	return (
		<aside aria-labelledby="customers" className="border-b border-zinc-200 bg-paper">
			<Page className="flex flex-col items-center gap-8 py-10 lg:gap-10 lg:py-14">
				<h2
					id="customers"
					className="text-center font-heading text-[1.1875rem] leading-[1.25] font-bold tracking-normal text-balance text-ink"
				>
					Built on an open-source platform trusted by 200+ brands
				</h2>
				<ul className="grid w-full grid-cols-2 items-center justify-items-center gap-x-10 gap-y-8 sm:grid-cols-3 lg:flex lg:max-w-[72rem] lg:justify-between lg:gap-x-8">
					{CUSTOMERS.map((customer) => (
						// Each mark sets its own height, so the row is enlarged as a whole. A wordmark set in type would pull in a bold weight of the body face that nothing else on the page uses.
						<li key={customer.name} className="flex h-6 items-center font-system [zoom:1.15] sm:[zoom:1.25]">
							<span role="img" aria-label={customer.name} className={customer.linkClass}>
								{customer.render()}
							</span>
						</li>
					))}
				</ul>
			</Page>
		</aside>
	);
}
