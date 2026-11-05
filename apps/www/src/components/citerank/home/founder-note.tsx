import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { demoSiteUrl } from "@workspace/config/referrals";
import { externalRel } from "@/lib/external-link";
import { Container, QUIET_LINK, Reveal } from "../ui";
import { DEMO_BRAND_PATH } from "./product-demo";

export function FounderNote() {
	const demoUrl = demoSiteUrl("marketing-page-cta", DEMO_BRAND_PATH);
	return (
		<section className="bg-white">
			<Container className="py-20 lg:py-24">
				<Reveal className="mx-auto max-w-2xl">
					<h2 className="heading-3 text-zinc-950">A Note From the Founder</h2>
					<div className="body-8 mt-8 space-y-5 text-zinc-700">
						<p>
							CiteRank.com started with a simple problem. Buyers were asking AI which products to choose, and most teams
							had no way to see what it told them. Checking by hand gave one answer on one day, and said nothing about
							what to change.
						</p>
						<p>
							So we built the checking properly: across 12 AI apps, every day, with every answer kept. And because a
							list of fixes is only useful if someone does them, we run an agency that does them.
						</p>
						<p>
							If you are not sure it is worth ${CLOUD_ENTRY_PRICE_USD} a month,{" "}
							<a href={demoUrl} target="_blank" rel={externalRel(demoUrl)} className={`${QUIET_LINK} text-zinc-950`}>
								try the live demo
							</a>{" "}
							first. It is the real product on a demo account, with no sign-up.
						</p>
					</div>
					<p className="mt-8 font-heading text-xl text-zinc-950">Adam</p>
					<p className="caption-2 mt-1 text-zinc-500">Founder, CiteRank.com</p>
				</Reveal>
			</Container>
		</section>
	);
}
