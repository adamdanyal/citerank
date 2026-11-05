import { FermatWordmark, SpeakeasyLockup, TradeSitesWordmark } from "@workspace/ui/brand/customers";
import { Container } from "../ui";

interface Customer {
	name: string;
	url: string;
	nofollow?: boolean;
	linkClass: string;
	render: () => React.ReactNode;
}

const customers: Customer[] = [
	{
		name: "Fermat Commerce",
		url: "https://www.fermatcommerce.com/?ref=citerank",
		nofollow: true,
		linkClass: "flex h-6 items-center text-zinc-500 transition-colors hover:text-[#0d3b25]",
		render: () => <FermatWordmark />,
	},
	{
		name: "Speakeasy",
		url: "https://www.speakeasy.com/?ref=citerank",
		linkClass: "flex h-6 items-center text-zinc-500 transition-colors hover:text-zinc-950",
		render: () => <SpeakeasyLockup />,
	},
	{
		name: "TradeSites",
		url: "https://www.tradesites.ai/?ref=citerank",
		linkClass: "group/ts flex h-6 items-center",
		render: () => (
			<TradeSitesWordmark className="grayscale transition-[filter] duration-300 group-hover/ts:grayscale-0" />
		),
	},
	{
		name: "Record Ranks",
		url: "https://recordranks.com/?ref=citerank",
		linkClass: "group/rr flex h-6 items-center",
		render: () => (
			<img
				src="/recordranks-logo.svg"
				width={106}
				height={24}
				alt=""
				aria-hidden="true"
				className="block h-6 w-auto grayscale transition-[filter] duration-300 group-hover/rr:grayscale-0"
			/>
		),
	},
	{
		name: "AskHotel",
		url: "https://askhotel.ai/?ref=citerank",
		linkClass: "group/ah flex h-6 items-center",
		render: () => (
			<img
				src="/askhotel-logo.png"
				width={95}
				height={24}
				alt=""
				aria-hidden="true"
				className="block h-6 w-auto grayscale transition-[filter] duration-300 group-hover/ah:grayscale-0"
			/>
		),
	},
	{
		name: "AISearch Global",
		url: "https://aisearch.global/?ref=citerank",
		linkClass: "group/asg flex h-6 items-center",
		render: () => (
			<img
				src="/aisearch-global-logo.svg"
				width={81}
				height={24}
				alt=""
				aria-hidden="true"
				className="block h-6 w-auto opacity-60 grayscale transition-[filter,opacity] duration-300 group-hover/asg:opacity-100 group-hover/asg:grayscale-0"
			/>
		),
	},
];

export function LogoStrip() {
	return (
		<section aria-labelledby="social-proof" className="bg-white">
			<Container className="py-16 lg:py-20">
				<h2 id="social-proof" className="heading-5 mx-auto max-w-[24ch] text-center text-zinc-950">
					Used by 200+ brands to optimize their AI visibility
				</h2>
				<ul className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-12">
					{customers.map((c) => (
						<li key={c.name} className="flex h-6 items-center">
							<a
								href={c.url}
								target="_blank"
								rel={c.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
								className={`${c.linkClass} rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600`}
								aria-label={c.name}
							>
								{c.render()}
							</a>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
