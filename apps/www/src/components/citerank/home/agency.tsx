import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Container, Eyebrow, PRIMARY_BUTTON, Reveal } from "../ui";

const WORK = [
	"Writes the comparison, alternatives and guide pages your site is missing",
	"Updates pages AI has stopped citing",
	"Gets you onto the review sites and best-of lists AI cites",
	"Answers buyers' questions in forums and communities",
	"Publishes guest articles on high-authority sites AI already cites",
	"Fixes anything that stops AI crawlers reading your site",
];

export function AgencySection() {
	return (
		<section className="bg-paper-2">
			<Container className="grid gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-24">
				<Reveal className="lg:col-span-5">
					<Eyebrow>AI Search Agency</Eyebrow>
					<h2 className="heading-2 mt-4 text-zinc-950">Want It Done for You?</h2>
					<p className="body-7 mt-6 text-zinc-600">
						The tracker ranks what to do next. Our AI search agency does that work every month, and a monthly report
						shows every piece of work, the question it targets, and the AI answers before and after.
					</p>
					<Link to="/agency" className={`${PRIMARY_BUTTON} mt-8`}>
						Book a call
						<ArrowRight className="size-4" aria-hidden="true" />
					</Link>
				</Reveal>
				<Reveal delay={100} className="lg:col-span-7 lg:pt-10">
					<ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
						{WORK.map((item) => (
							<li key={item} className="flex items-start gap-3 body-3 text-zinc-700">
								<span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-white text-blue-700">
									<Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
								</span>
								{item}
							</li>
						))}
					</ul>
				</Reveal>
			</Container>
		</section>
	);
}
