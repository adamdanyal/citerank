import { CUSTOMERS } from "@/components/home/logos";
import { Page, TEXT } from "./kit";

/* Who already relies on it, straight under the hero. */
export function Logos() {
	return (
		<aside aria-labelledby="customers" className="border-b border-(--v3-line)">
			<Page className="flex flex-col items-center gap-8 py-12 lg:gap-10 lg:py-16">
				<h2
					id="customers"
					className={`text-center font-(family-name:--v3-display) text-[1.1875rem] leading-[1.3] font-medium text-balance ${TEXT}`}
				>
					Built on an open-source platform trusted by 200+ brands
				</h2>
				<ul className="grid w-full grid-cols-2 items-center justify-items-center gap-x-10 gap-y-8 sm:grid-cols-3 lg:flex lg:max-w-[72rem] lg:justify-between lg:gap-x-8">
					{CUSTOMERS.map((customer) => (
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
