import { EngineIcon } from "@/components/home/engines";
import { CARD, Container, Reveal, RevealItem } from "../ui";

const ENGINES = [
	{ name: "ChatGPT", iconId: "openai" },
	{ name: "Claude", iconId: "anthropic" },
	{ name: "Gemini", iconId: "gemini" },
	{ name: "Perplexity", iconId: "perplexity" },
	{ name: "AI Overviews", iconId: "google" },
	{ name: "AI Mode", iconId: "google" },
	{ name: "Copilot", iconId: "microsoft" },
	{ name: "Grok", iconId: "x" },
	{ name: "DeepSeek", iconId: "deepseek" },
	{ name: "Mistral", iconId: "mistral" },
	{ name: "Qwen", iconId: "qwen" },
	{ name: "Kimi", iconId: "moonshotai" },
];

export function EngineCoverage() {
	return (
		<section className="bg-white">
			<Container className="grid gap-10 py-20 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-24">
				<Reveal className="lg:col-span-5">
					<h2 className="heading-2 text-zinc-950">It Checks 12 AI Apps, Not Just ChatGPT</h2>
					<p className="body-7 mt-6 text-zinc-600">
						CiteRank.com both scrapes what real users see in popular AI search tools and captures the other six models
						with direct API calls.
					</p>
				</Reveal>
				<ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-7" aria-label="AI engines CiteRank.com tracks">
					{ENGINES.map((engine, index) => (
						<RevealItem
							key={engine.name}
							delay={index * 40}
							className={`${CARD} flex items-center gap-3 py-3 pl-3 pr-4 title-4 text-zinc-900`}
						>
							<span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-paper-2">
								<EngineIcon iconId={engine.iconId} className="size-4" />
							</span>
							<span className="truncate">{engine.name}</span>
						</RevealItem>
					))}
				</ul>
			</Container>
		</section>
	);
}
