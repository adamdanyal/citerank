import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { SectionHeading } from "./ui";

const WORK = [
	"Writes the comparison, alternatives and guide pages your site is missing",
	"Updates pages AI has stopped citing",
	"Gets you onto the review sites and best-of lists AI cites",
	"Answers buyers' questions in forums and communities",
	"Publishes guest articles on high-authority sites AI already cites",
	"Fixes anything that stops AI crawlers reading your site",
];

export function AgencyTeaser() {
	return (
		<section className="border-t border-zinc-200/80 bg-zinc-50/70">
			<div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:px-6 lg:grid-cols-12 lg:gap-12 lg:py-28">
				<div className="lg:col-span-5">
					<SectionHeading
						title="Want It Done for You?"
						lede="The tracker ranks what to do next. Our AI search agency does that work every month, and a monthly report shows every piece of work, the question it targets, and the AI answers before and after."
					/>
					<Link
						to="/agency"
						className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-base font-medium leading-none text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
					>
						Book a call
						<ArrowRight className="size-4" aria-hidden="true" />
					</Link>
				</div>
				<ul className="grid content-start gap-3 sm:grid-cols-2 lg:col-span-7">
					{WORK.map((item) => (
						<li
							key={item}
							className="flex items-start gap-3 rounded-xl bg-white p-4 text-[15px]/6 text-zinc-700 shadow-[0_0_0_1px_rgb(24_24_27/0.08),0_1px_2px_rgb(24_24_27/0.04)]"
						>
							<Check className="mt-1 size-4 shrink-0 text-blue-600" strokeWidth={2.5} aria-hidden="true" />
							{item}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
