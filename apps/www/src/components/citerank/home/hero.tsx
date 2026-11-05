import { Link } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { cloudSignupUrl, demoSiteUrl, type ReferralSource } from "@workspace/config/referrals";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { externalRel } from "@/lib/external-link";
import { Container, EASE_CLASS, PRIMARY_BUTTON_LG, QUIET_LINK } from "../ui";
import { DEMO_BRAND_PATH, ProductDemo } from "./product-demo";

const DEFAULT_LEDE =
	"CiteRank.com is the AI visibility tracker and AI search agency for AEO and GEO. See how ChatGPT, Claude, Gemini and nine other AI apps talk about your brand, which sources they trust, and what to do to get recommended.";

/** The low-commitment path beside the main button: the real product on a demo account, no sign-up. */
function DemoTour({ href }: { href: string }) {
	return (
		<a
			href={href}
			target="_blank"
			rel={externalRel(href)}
			className="group flex items-center gap-3 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
		>
			<span className="relative block h-12 w-16 shrink-0 overflow-hidden rounded-md bg-white shadow-[0_1px_2px_rgb(26_25_23/0.1),0_8px_16px_-8px_rgb(26_25_23/0.3)]">
				<img
					src="/screenshots/overview.png"
					alt=""
					width={3000}
					height={1800}
					loading="eager"
					decoding="async"
					className="absolute left-0 top-0 w-[220%] max-w-none"
				/>
			</span>
			<span>
				<span
					className={`body-5 block text-zinc-950 transition-colors duration-300 ${EASE_CLASS} group-hover:text-blue-700`}
				>
					Try the live demo
				</span>
				<span className="caption-2 block text-zinc-500">The real product, no sign-up</span>
			</span>
		</a>
	);
}

export function Hero({
	title = "Track Your Brand in AI Search",
	lede = DEFAULT_LEDE,
	from = "marketing-hero",
}: {
	title?: string;
	lede?: ReactNode;
	from?: ReferralSource;
} = {}) {
	const signupUrl = cloudSignupUrl(from);
	const demoUrl = demoSiteUrl(from, DEMO_BRAND_PATH);

	return (
		<section className="relative overflow-hidden bg-paper">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(0_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
			/>

			<Container className="relative pt-32 lg:pt-40">
				<div className="mx-auto flex max-w-3xl flex-col items-center text-center">
					<p className="caption-3 rounded-md bg-blue-50 px-3 py-1 text-blue-800">
						AI Visibility Tracker + AI Search Agency
					</p>
					<h1 className="heading-1 cr-gradient-text mt-8">{title}</h1>
					<p className="body-8 mt-6 max-w-[60ch] text-zinc-600">{lede}</p>
					<div className="mt-8 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:gap-5">
						<a href={signupUrl} className={`${PRIMARY_BUTTON_LG} w-full sm:w-auto`}>
							Start tracking
							<ArrowRight className="size-4" aria-hidden="true" />
						</a>
						<span className="caption-2 text-zinc-500">or</span>
						<DemoTour href={demoUrl} />
					</div>
					<p className="caption-2 mt-6 text-zinc-500">
						Tracker plans from ${CLOUD_ENTRY_PRICE_USD} a month. Cancel any time.{" "}
						<Link to="/pricing" className={QUIET_LINK}>
							See pricing
						</Link>
					</p>
				</div>
			</Container>

			<div className="relative mt-16 md:mt-20">
				<div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
				<Container className="relative">
					<ProductDemo />
				</Container>
			</div>
		</section>
	);
}
