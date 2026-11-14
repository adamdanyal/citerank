import { CUSTOMERS } from "@/components/home/logos";
import { Page, SMALL } from "./kit";

/* Who already relies on it, straight under the hero, where a visitor is still deciding whether to read on. */
export function Logos() {
	return (
		<aside aria-labelledby="customers" className="border-b border-zinc-200 bg-paper">
			<Page className="flex flex-col items-center gap-8 py-10 lg:flex-row lg:gap-16 lg:py-12">
				<h2
					id="customers"
					className={`${SMALL} min-w-0 shrink-0 text-center font-sans font-normal tracking-normal text-zinc-600 lg:max-w-[15rem] lg:text-left`}
				>
					Built on an open-source platform trusted by 200+ brands
				</h2>
				<ul className="grid w-full grid-cols-2 items-center justify-items-center gap-x-10 gap-y-8 sm:grid-cols-3 lg:flex lg:flex-1 lg:justify-between lg:gap-x-8">
					{CUSTOMERS.map((customer) => (
						<li key={customer.name} className="flex h-6 items-center">
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
