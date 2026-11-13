import { BODY, HEADING, MONO, PANEL, PANEL_PAD, Page, PILL_QUIET } from "./kit";

const PARAGRAPHS = [
	"Your buyers ask ChatGPT, Perplexity or Gemini which product to pick. The answer names two or three brands. There is no page two, and nothing tells you whether you were in it.",
	"So you check by hand: one prompt, one app, one day. It says nothing about the trend or what to change. The big tools are sold with sales calls and yearly contracts.",
	"CiteRank.com is the tracker we wanted instead. It asks 13 AI apps your buyers' questions up to four times a day, keeps every answer and ranks what to fix. If nobody has time for the fixes, our agency does them.",
	"Try the live demo first. If it is useful, start tracking. We would be glad to have you.",
];

/* A letter, set as one: narrow measure, the opening line large, the signature at the end. */
export function Letter() {
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<div className="mx-auto max-w-[46rem]">
					<p>
						<span className={PILL_QUIET}>From the founder</span>
					</p>

					<div className="mt-8 flex items-center gap-4 border-b border-zinc-200 pb-6">
						<img
							src="/founder.jpg"
							alt="Adam Danyal"
							width={256}
							height={256}
							loading="lazy"
							decoding="async"
							className="size-12 rounded-full object-cover"
						/>
						<div>
							<p className="font-heading text-[1.0625rem] font-semibold text-ink">Adam Danyal</p>
							<p className={MONO}>Founder, CiteRank.com</p>
						</div>
						<a
							href="https://www.linkedin.com/in/adamdanyal/"
							target="_blank"
							rel="noopener noreferrer"
							className={`${MONO} ml-auto rounded-sm underline decoration-zinc-300 underline-offset-4 hover:decoration-rust focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust`}
						>
							Trusted by 2M+ on LinkedIn
						</a>
					</div>

					<h2 className={`${HEADING} mt-10 text-ink`}>Tell me if this sounds familiar.</h2>
					<div className="mt-8 space-y-6">
						{PARAGRAPHS.map((paragraph) => (
							<p key={paragraph.slice(0, 24)} className={`${BODY} text-zinc-600`}>
								{paragraph}
							</p>
						))}
					</div>
					<img
						src="/signature.png"
						alt="Adam Danyal"
						width={815}
						height={267}
						loading="lazy"
						decoding="async"
						className="mt-10 h-14 w-auto"
					/>
				</div>
			</Page>
		</section>
	);
}
