import { EngineIcon } from "@/components/home/engines";
import { Container, Eyebrow, Reveal } from "../ui";

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
		<section className="bg-paper-2">
			<Container className="grid gap-10 py-20 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-24">
				<Reveal className="lg:col-span-5">
					<Eyebrow>Coverage</Eyebrow>
					<h2 className="heading-2 mt-4 text-zinc-950">12 Answer Engines Your Buyers Use</h2>
					<p className="body-7 mt-6 text-zinc-600">
						CiteRank.com both scrapes what real users see in popular AI search tools and captures the other six models
						with direct API calls.
					</p>
				</Reveal>
				<Reveal delay={100} className="lg:col-span-7">
					<ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="AI engines CiteRank.com tracks">
						{ENGINES.map((engine) => (
							<li
								key={engine.name}
								className="flex h-12 items-center gap-3 rounded-lg bg-white px-4 title-4 text-zinc-900"
							>
								<EngineIcon iconId={engine.iconId} className="size-4 shrink-0" />
								<span className="truncate">{engine.name}</span>
							</li>
						))}
					</ul>
				</Reveal>
			</Container>
		</section>
	);
}
