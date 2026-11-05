import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { Container, QUIET_LINK, Reveal } from "../ui";

/* Fill these in before launch: a photo at apps/www/public/founder.jpg and the LinkedIn profile URL. */
const FOUNDER = {
	name: "Adam",
	title: "Founder, CiteRank.com",
	photo: undefined as string | undefined,
	linkedin: undefined as string | undefined,
};

/* A letter in the founder's voice: the reader's situation first, then what CiteRank.com does about it. */
export function Letter() {
	return (
		<section className="bg-white">
			<Container className="py-20 lg:py-24">
				<Reveal className="mx-auto max-w-2xl rounded-2xl bg-paper p-8 shadow-[0_1px_2px_rgb(26_25_23/0.05),0_32px_64px_-40px_rgb(26_25_23/0.35)] ring-1 ring-zinc-950/5 sm:p-12">
					<p className="heading-4 text-zinc-950">Tell me if this sounds familiar.</p>
					<div className="body-8 mt-8 space-y-5 text-zinc-800">
						<p>
							Your buyers ask ChatGPT, Perplexity or Gemini which product to pick. The answer names two or three brands
							and cites a few sources. There is no page two, and nothing tells you whether you were in it.
						</p>
						<p>
							So you check by hand: one prompt, one app, one day. It says nothing about the trend or what to change. The
							big tools are sold to large companies, with sales calls and yearly contracts.
						</p>
						<p>
							CiteRank.com is the tracker we wanted instead. Sign up in minutes. It asks 12 AI apps your buyers'
							questions up to four times a day, keeps every answer and ranks what to fix. From ${CLOUD_ENTRY_PRICE_USD}{" "}
							a month, cancel any time. If nobody has time for the fixes, our agency does them.
						</p>
						<p>Try the live demo first. If it is useful, start tracking. We would be glad to have you.</p>
					</div>
					<div className="mt-10 flex items-center gap-4">
						{FOUNDER.photo ? (
							<img
								src={FOUNDER.photo}
								alt={`${FOUNDER.name}, ${FOUNDER.title}`}
								width={64}
								height={64}
								loading="lazy"
								className="size-16 rounded-lg object-cover"
							/>
						) : null}
						<div>
							<p className="font-heading text-2xl text-zinc-950">{FOUNDER.name}</p>
							<p className="caption-2 text-zinc-500">
								{FOUNDER.title}
								{FOUNDER.linkedin ? (
									<>
										{" · "}
										<a
											href={FOUNDER.linkedin}
											target="_blank"
											rel="noopener noreferrer"
											className={`${QUIET_LINK} text-zinc-700`}
										>
											LinkedIn
										</a>
									</>
								) : null}
							</p>
						</div>
					</div>
				</Reveal>
			</Container>
		</section>
	);
}
