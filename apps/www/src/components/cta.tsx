import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { bookDemoUrl } from "@workspace/config/referrals";
import { CloudSignupCTA } from "./cta-buttons";

const DEMO_URL = bookDemoUrl("marketing-cta");

export function CTA() {
	return (
		<section className="relative border-b border-zinc-200 bg-white">
			<div aria-hidden="true" className="pointer-events-none absolute inset-0" />
			<div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 lg:py-24">
				<div className="grid items-center gap-10 lg:grid-cols-12">
					<div className="lg:col-span-7">
						<h2 className="max-w-[18ch] text-4xl font-semibold leading-[1.05] tracking-tight text-balance text-zinc-950 md:text-5xl">
							Start tracking AI answers today.
						</h2>
						<p className="mt-5 max-w-[52ch] text-pretty text-zinc-600 md:text-lg">
							Sign up for the cloud and we run everything for you from ${CLOUD_ENTRY_PRICE_USD}/mo, with unlimited seats
							and API/MCP access on every plan.
						</p>
						<div className="mt-7 flex flex-wrap items-center gap-2">
							<CloudSignupCTA />
						</div>
						{/* A fourth button would flatten the three above it, so the call
						    that suits someone still deciding is offered as a sentence. */}
						<p className="mt-4 text-sm text-zinc-500">
							Would you rather hand the work over?{" "}
							<a href={DEMO_URL} className="font-medium text-zinc-700 underline underline-offset-2 hover:text-zinc-950">
								Book an agency call
							</a>
							.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
