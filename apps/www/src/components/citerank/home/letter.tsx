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
							Your buyers ask ChatGPT, Perplexity or Gemini which product to pick. The answer names two or three brands,
							cites a few sources, and that is it. There is no page two, and nothing tells you whether you were in it.
						</p>
						<p>
							So you check by hand. One prompt, one app, one day. It says nothing about the trend or about what to
							change. The best known tools that do this properly are sold to enterprises, through sales calls and annual
							contracts.
						</p>
						<p>
							CiteRank.com is the tracker we wanted instead. You sign up in minutes. It asks 12 AI apps the questions
							your buyers ask, up to four times a day, keeps every answer, and ranks what to fix. Plans start at $
							{CLOUD_ENTRY_PRICE_USD} a month and you can cancel any time. And if nobody on your team has time for the
							fixes, our agency does them.
						</p>
						<p>
							Thanks for reading. Try the live demo first, and if it is useful, start tracking. We would be glad to have
							you as a customer.
						</p>
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
						) : (
							<span
								aria-hidden="true"
								className="inline-flex size-16 items-center justify-center rounded-lg bg-blue-50 font-heading text-2xl text-blue-800"
							>
								{FOUNDER.name[0]}
							</span>
						)}
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
