import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Container, PRIMARY_BUTTON, Reveal } from "../ui";

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
					<h2 className="heading-2 text-zinc-950">Want It Done for You?</h2>
					<p className="body-7 mt-6 text-zinc-600">
						The tracker ranks what to do next. Our AI search agency does that work every month, and a monthly report
						shows every piece of work, the question it targets, and the AI answers before and after.
					</p>
					<Link to="/agency" className={`${PRIMARY_BUTTON} mt-8`}>
						Book a call
						<ArrowRight className="size-4" aria-hidden="true" />
					</Link>
				</Reveal>
				<Reveal delay={100} className="lg:col-span-7">
					<ul className="divide-y divide-zinc-200/80 border-y border-zinc-200/80">
						{WORK.map((item) => (
							<li key={item} className="body-3 py-4 text-zinc-700">
								{item}
							</li>
						))}
					</ul>
				</Reveal>
			</Container>
		</section>
	);
}
