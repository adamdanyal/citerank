import { Link } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { cloudSignupUrl, type ReferralSource } from "@workspace/config/referrals";
import { ArrowRight } from "lucide-react";
import { Container, PRIMARY_BUTTON, Reveal, SECONDARY_BUTTON } from "../ui";

export function Closing({ from = "marketing-closing" }: { from?: ReferralSource }) {
	const signupUrl = cloudSignupUrl(from);
	return (
		<section className="relative overflow-hidden bg-paper">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(0_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_top,black,transparent_85%)]"
			/>
			<Container className="relative py-20 lg:py-24">
				<Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
					<h2 className="heading-2 text-zinc-950">Know Where You Stand in AI Search</h2>
					<p className="body-8 mt-6 max-w-[60ch] text-zinc-600">
						Set up takes minutes, and plans start at ${CLOUD_ENTRY_PRICE_USD} a month.
					</p>
					<div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
						<a href={signupUrl} className={PRIMARY_BUTTON}>
							Start tracking
							<ArrowRight className="size-4" aria-hidden="true" />
						</a>
						<Link to="/agency" className={SECONDARY_BUTTON}>
							Have us do the work
						</Link>
					</div>
					<p className="caption-2 mt-6 text-zinc-500">Unlimited seats on every plan. Cancel any time.</p>
				</Reveal>
			</Container>
		</section>
	);
}
