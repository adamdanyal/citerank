import { CUSTOMERS } from "@/components/home/logos";
import { Container } from "../ui";

export function Logos() {
	return (
		<section aria-labelledby="customers" className="bg-white">
			<Container className="py-12 lg:py-16">
				<h2 id="customers" className="caption-1 text-center text-zinc-500">
					Used by 200+ brands to track their AI visibility
				</h2>
				<ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
					{CUSTOMERS.map((customer) => (
						<li key={customer.name} className="flex h-6 items-center">
							<a
								href={customer.url}
								target="_blank"
								rel={customer.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
								className={`${customer.linkClass} rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600`}
								aria-label={customer.name}
							>
								{customer.render()}
							</a>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
