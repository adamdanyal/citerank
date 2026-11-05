import { Link } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { cloudSignupUrl, type ReferralSource } from "@workspace/config/referrals";
import { ArrowRight, Check } from "lucide-react";
import { Container, LinkArrow, PRIMARY_BUTTON, Reveal, TEXT_LINK } from "../ui";

const INCLUDED = ["Cancel any time", "Unlimited seats", "API and MCP access"];

export function Closing({ from = "marketing-closing" }: { from?: ReferralSource }) {
	const signupUrl = cloudSignupUrl(from);
	return (
		<section className="relative overflow-hidden bg-paper">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(0_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_top,black,transparent_85%)]"
			/>
			<Container className="relative py-20 lg:py-24">
				<Reveal className="mx-auto flex max-w-[42.5rem] flex-col items-center text-center">
					<h2 className="heading-1 text-zinc-950">Know Where You Stand in AI Search</h2>
					<p className="body-8 mt-6 text-zinc-600">
						Set up takes minutes, and plans start at ${CLOUD_ENTRY_PRICE_USD} a month.
					</p>
					<div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
						<a href={signupUrl} className={PRIMARY_BUTTON}>
							Start tracking
							<ArrowRight className="size-4" aria-hidden="true" />
						</a>
						<Link to="/agency" className={TEXT_LINK}>
							Have us do the work
							<LinkArrow />
						</Link>
					</div>
					<ul className="caption-1 mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-zinc-600">
						{INCLUDED.map((item) => (
							<li key={item} className="inline-flex items-center gap-2">
								<Check className="size-4 text-blue-600" strokeWidth={2.5} aria-hidden="true" />
								{item}
							</li>
						))}
					</ul>
				</Reveal>
			</Container>
		</section>
	);
}
