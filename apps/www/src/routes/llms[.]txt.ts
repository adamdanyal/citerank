import { createFileRoute } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { productFeatures } from "@/data/features";
import { SITE_URL } from "@/lib/seo";

const featureLinks = productFeatures
	.map((f) => `  - [${f.name}](${SITE_URL}/features/${f.slug}): ${f.summary}`)
	.join("\n");

// Curated llms.txt for the marketing site, following the llmstxt.org convention:
// an H1, a one-paragraph summary, a short positioning blurb, then sections of
// annotated links. The full text of the documentation lives at /llms-full.txt.
const llmsTxt = `# CiteRank.com

> CiteRank.com is an AI visibility tracker and AI search agency for businesses that want to be named when buyers ask ChatGPT, Gemini, Perplexity and Google AI Overviews who to choose. The AI Visibility Tracker shows how often a business is named and what to change. The AI search agency makes those changes for businesses that would rather hand the work over.

The AI Visibility Tracker puts a business's buyer questions to the AI apps it chooses (ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok, DeepSeek, Mistral, Qwen, Kimi, Google AI Overviews and Google AI Mode) up to four times a day, and keeps every answer in full. It shows how often the business is named for each question and each AI, its share of voice against each competitor, how each answer describes it, its position among the brands named, which pages each answer cites, and the web searches an AI ran before answering. About once a week it ranks what to do next. Tracker plans start at $${CLOUD_ENTRY_PRICE_USD}/month. CiteRank.com is a trading name of Danx Digital Limited, registered in the United Kingdom, and was founded by Adam Danyal and Julia Danyal.

## Product

- [CiteRank.com](${SITE_URL}/): See what AI says about your business, how often it names you against competitors, which pages it cites, and what to change next.
- [Features](${SITE_URL}/features): Visibility dashboard, per-question and per-AI tracking, share of voice, sentiment, position, citation analysis, query fan-out, ranked opportunities, prompt management, full answers and long-term trends.
${featureLinks}
- [Pricing](${SITE_URL}/pricing): Starter, Basic, Pro and Business tracker plans from $${CLOUD_ENTRY_PRICE_USD}/month. Yearly billing saves two months.
- [AI Search Agency](${SITE_URL}/agency): The team that does the work the tracker ranks, with a monthly before-and-after report.
- [About](${SITE_URL}/about): Company facts, founders, what we do, who it is for, pricing and contract terms.

## Documentation

- [Documentation](${SITE_URL}/docs.md): Introduction to CiteRank.com, the AI visibility tracker and agency.
- [Quick Start](${SITE_URL}/docs/getting-started.md): Sign up, choose a plan, add your brand and read your first AI visibility results.
- [User Guide](${SITE_URL}/docs/user-guide.md): A walkthrough from first login to daily visibility tracking, prompts, citations, competitors, sentiment and reports.
- [API Reference](${SITE_URL}/docs/api.md): REST API documentation for reading and managing your CiteRank.com data.
- [MCP Server](${SITE_URL}/docs/api/mcp.md): Connect Claude Code, Cursor or another AI client to CiteRank.com over the Model Context Protocol.
- [llms-full.txt](${SITE_URL}/llms-full.txt): The full text of all CiteRank.com documentation in a single file.

## Resources

- [Blog](${SITE_URL}/blog): Research on how AI answer engines choose and cite sources.
- [AI Visibility Tool Directory](${SITE_URL}/ai-visibility-tools): Compare 100+ AI visibility and answer engine optimization tools, with a feature matrix, pricing and head-to-head comparisons with CiteRank.com.
- [AEO Glossary](${SITE_URL}/glossary): Definitions of the terms used in AI search.
- [AI Search Statistics](${SITE_URL}/statistics): Sourced statistics on AI search.

## Optional

- [LinkedIn](https://www.linkedin.com/company/citerank): Company updates from CiteRank.com.
- [X / Twitter](https://x.com/tryciterank): Product updates and AI visibility insights.
`;

export const Route = createFileRoute("/llms.txt")({
	server: {
		handlers: {
			GET() {
				return new Response(llmsTxt, {
					headers: { "Content-Type": "text/plain; charset=utf-8" },
				});
			},
		},
	},
});
