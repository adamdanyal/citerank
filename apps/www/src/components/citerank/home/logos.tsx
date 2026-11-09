import { CUSTOMERS } from "@/components/home/logos";
import { Container } from "../ui";

export function Logos() {
	return (
		<section aria-labelledby="customers" className="bg-white">
			<Container className="py-12 lg:py-16">
				<h2 id="customers" className="caption-1 text-center text-zinc-500">
					Built on an open-source platform trusted by 200+ brands
				</h2>
				<ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
					{CUSTOMERS.map((customer) => (
						<li key={customer.name} className="flex h-6 items-center">
							<span role="img" aria-label={customer.name} className={customer.linkClass}>
								{customer.render()}
							</span>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
