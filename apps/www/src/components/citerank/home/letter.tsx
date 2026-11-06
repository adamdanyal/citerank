import { useEffect, useRef, useState } from "react";
import { CARD, Container, Reveal, SECONDARY_BUTTON } from "../ui";

/* The photo is apps/www/public/founder.jpg, the signature apps/www/public/signature.png. */
const FOUNDER = {
	name: "Adam Danyal",
	title: "Founder, CiteRank.com",
	proof: "Trusted by 2M+ on LinkedIn",
	photo: "/founder.jpg",
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
		text: "CiteRank.com is the tracker we wanted instead. It asks 12 AI apps your buyers' questions up to four times a day, keeps every answer and ranks what to fix. If nobody has time for the fixes, our agency does them.",
	},
	{
		id: "invite",
		text: "Try the live demo first. If it is useful, start tracking. We would be glad to have you.",
	},
];

function LinkedInMark() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
			<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
		</svg>
	);
}

/* The server renders the image, so a missing file errors before React hydrates and onError alone would miss it. */
function Portrait() {
	const ref = useRef<HTMLImageElement>(null);
	const [missing, setMissing] = useState(false);
	useEffect(() => {
		const img = ref.current;
		if (img?.complete && img.naturalWidth === 0) setMissing(true);
	}, []);
	if (missing) {
		return (
			<span
				aria-hidden="true"
				className="heading-5 inline-flex size-24 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800"
			>
				{FOUNDER.name
					.split(" ")
					.map((part) => part[0])
					.join("")}
			</span>
		);
	}
	return (
		<img
			ref={ref}
			src={FOUNDER.photo}
			alt={FOUNDER.name}
			width={96}
			height={96}
			loading="lazy"
			onError={() => setMissing(true)}
			className="size-24 shrink-0 rounded-xl object-cover"
		/>
	);
}

/* A letter in the founder's voice: the reader's situation first, then what CiteRank.com does about it. */
export function Letter() {
	return (
		<section className="bg-paper-2">
			<Container className="py-20 lg:py-24">
				<Reveal className={`${CARD} mx-auto max-w-5xl overflow-hidden`}>
					<div className="grid lg:grid-cols-12">
						<aside className="flex flex-col gap-6 bg-paper p-8 sm:flex-row sm:items-center lg:col-span-4 lg:flex-col lg:items-start lg:p-10">
							<Portrait />
							<div className="min-w-0">
								<p className="heading-5 text-zinc-950">{FOUNDER.name}</p>
								<p className="body-6 mt-1 text-zinc-600">{FOUNDER.title}</p>
								<a
									href={FOUNDER.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className={`${SECONDARY_BUTTON} mt-4`}
								>
									<LinkedInMark />
									{FOUNDER.proof}
								</a>
							</div>
						</aside>
						<div className="p-8 lg:col-span-8 lg:p-12">
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
								className="mt-10 h-16 w-auto"
							/>
						</div>
					</div>
				</Reveal>
			</Container>
		</section>
	);
}
