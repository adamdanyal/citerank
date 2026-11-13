import { CARD, Container, EASE_CLASS, Reveal } from "../ui";

/* The photo is apps/www/public/founder.jpg, the signature apps/www/public/signature.png. */
const FOUNDER = {
	name: "Adam Danyal",
	title: "Founder, CiteRank.com",
	proof: "Trusted by 2M+ on LinkedIn",
	photo: { src: "/founder.jpg", width: 256, height: 256 },
	signature: { src: "/signature.png", width: 815, height: 267 },
	linkedin: "https://www.linkedin.com/in/adamdanyal/",
};

const PARAGRAPHS = [
	{
		id: "problem",
		text: "Your buyers ask ChatGPT, Perplexity or Gemini which product to pick. The answer names two or three brands. There is no page two, and nothing tells you whether you were in it.",
	},
	{
		id: "by-hand",
		text: "So you check by hand: one prompt, one app, one day. It says nothing about the trend or what to change. The big tools are sold with sales calls and yearly contracts.",
	},
	{
		id: "tracker",
		text: "CiteRank.com is the tracker we wanted instead. It asks 13 AI apps your buyers' questions up to four times a day, keeps every answer and ranks what to fix. If nobody has time for the fixes, our agency does them.",
	},
	{
		id: "invite",
		text: "Try the live demo first. If it is useful, start tracking. We would be glad to have you.",
	},
];

function LinkedInMark() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 fill-current">
			<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
		</svg>
	);
}

/* A letter in the founder's voice: who is writing, the reader's situation, then what CiteRank.com does about it. */
export function Letter() {
	return (
		<section className="bg-paper-2">
			<Container className="py-20 lg:py-24">
				<Reveal className={`${CARD} mx-auto max-w-3xl overflow-hidden`}>
					<header className="flex flex-wrap items-center gap-4 border-zinc-200 border-b bg-paper px-6 py-5 sm:px-8 lg:px-14">
						<img
							src={FOUNDER.photo.src}
							alt={FOUNDER.name}
							width={FOUNDER.photo.width}
							height={FOUNDER.photo.height}
							loading="lazy"
							className="size-14 shrink-0 rounded-lg object-cover"
						/>
						<div className="min-w-0">
							<p className="heading-6 text-zinc-950">{FOUNDER.name}</p>
							<p className="body-6 text-zinc-600">{FOUNDER.title}</p>
						</div>
						<a
							href={FOUNDER.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							className={`caption-1 inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-blue-800 transition-colors duration-300 ${EASE_CLASS} hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:ml-auto`}
						>
							<LinkedInMark />
							{FOUNDER.proof}
						</a>
					</header>
					<div className="px-6 py-8 sm:p-8 lg:px-14 lg:py-12">
						<p className="heading-4 text-zinc-950">Tell me if this sounds familiar.</p>
						<div className="body-7 mt-8 space-y-5 text-zinc-800">
							{PARAGRAPHS.map((paragraph) => (
								<p key={paragraph.id}>{paragraph.text}</p>
							))}
						</div>
						<img
							src={FOUNDER.signature.src}
							alt={FOUNDER.name}
							width={FOUNDER.signature.width}
							height={FOUNDER.signature.height}
							loading="lazy"
							className="mt-10 h-14 w-auto"
						/>
					</div>
				</Reveal>
			</Container>
		</section>
	);
}
