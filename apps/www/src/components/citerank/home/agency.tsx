import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/posthog";
import { Container, PRIMARY_BUTTON, Reveal } from "../ui";

const WORK = [
	{ tag: "Content", text: "Writes the comparison, alternatives and guide pages your site is missing" },
	{ tag: "Content", text: "Updates pages AI has stopped citing" },
	{ tag: "Outreach", text: "Gets you onto the review sites and best-of lists AI cites" },
	{ tag: "Community", text: "Answers buyers' questions in forums and communities" },
	{ tag: "Outreach", text: "Publishes guest articles on high-authority sites AI already cites" },
	{ tag: "Technical", text: "Fixes anything that stops AI crawlers reading your site" },
];

export function AgencySection() {
	return (
		<section className="cr-grain relative bg-white">
			<Container className="relative grid gap-12 py-20 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-24">
				<Reveal className="lg:col-span-5">
					<h2 className="heading-2 text-zinc-950">We do the work for you</h2>
					<p className="body-7 mt-6 text-zinc-600">
						The tracker ranks what to do next. Our agency does it every month and reports the AI answers before and
						after.
					</p>
					<Link
						to="/agency"
						onClick={() => trackEvent("agency_call_click", { from: "home" })}
						className={`${PRIMARY_BUTTON} mt-8`}
					>
						Book a call
						<ArrowRight className="size-4" aria-hidden="true" />
					</Link>
				</Reveal>
				<Reveal delay={100} className="lg:col-span-7">
					<div className="rounded-2xl bg-white p-2 shadow-[0_1px_2px_rgb(26_25_23/0.05),0_24px_48px_-24px_rgb(26_25_23/0.25)]">
						<div className="flex items-baseline justify-between gap-4 px-4 pb-3 pt-3">
							<p className="title-3 text-zinc-950">What a month includes</p>
							<p className="caption-2 text-zinc-500">Reported with the AI answers before and after</p>
						</div>
						<ul className="divide-y divide-zinc-200/80 rounded-lg bg-paper-2/60">
							{WORK.map((item) => (
								<li key={item.text} className="flex items-start gap-4 px-4 py-4">
									<span className="caption-3 w-24 shrink-0 rounded-md bg-white px-2 py-1 text-center text-zinc-600">
										{item.tag}
									</span>
									<span className="body-6 text-zinc-800">{item.text}</span>
								</li>
							))}
						</ul>
					</div>
				</Reveal>
			</Container>
		</section>
	);
}
