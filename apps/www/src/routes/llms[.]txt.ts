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

The AI Visibility Tracker puts a business's buyer questions to the AI apps it chooses (ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok, DeepSeek, Mistral, Google AI Overviews and Google AI Mode) up to four times a day, and keeps every answer in full. It shows how often the business is named for each question and each AI, its share of voice against each competitor, how each answer describes it, its position among the brands named, which pages each answer cites, and the web searches an AI ran before answering. About once a week it ranks what to do next. Tracker plans start at $${CLOUD_ENTRY_PRICE_USD}/month. CiteRank.com is a trading name of Danx Digital Limited, registered in the United Kingdom, and was founded by Adam Danyal and Julia Danyal.

## Product

- [CiteRank.com](${SITE_URL}/): See what AI says about your business and what to change.
- [Features](${SITE_URL}/features): Visibility, share of voice, sentiment, position, citations, query fan-out and ranked opportunities.
${featureLinks}
- [Pricing](${SITE_URL}/pricing): Starter, Basic, Pro and Business tracker plans from $${CLOUD_ENTRY_PRICE_USD}/month. Yearly billing saves two months.
- [AI Search Agency](${SITE_URL}/agency): The team that does the work the tracker ranks, with a monthly before-and-after report.
- [About](${SITE_URL}/about): Company facts, founders, pricing and contract terms.

## Documentation

- [Documentation](${SITE_URL}/docs.md): Introduction to CiteRank.com.
- [Getting Started](${SITE_URL}/docs/getting-started.md): Sign up, add a brand and read your first results.
- [User Guide](${SITE_URL}/docs/user-guide.md): A walkthrough from first login to daily tracking, prompts, citations and competitors.
- [API Reference](${SITE_URL}/docs/api.md): REST API documentation.
- [MCP Server](${SITE_URL}/docs/api/mcp.md): Connect Claude Code or another AI client to CiteRank.com over the Model Context Protocol.
- [llms-full.txt](${SITE_URL}/llms-full.txt): The full text of the documentation in a single file.

## Resources

- [Blog](${SITE_URL}/blog): Research on how AI answer engines choose and cite sources.
- [AI Visibility Tool Directory](${SITE_URL}/ai-visibility-tools): Compare 100+ AI visibility and answer engine optimization tools.
- [AEO Glossary](${SITE_URL}/glossary): Definitions of the terms used in AI search.
- [AI Search Statistics](${SITE_URL}/statistics): Sourced statistics on AI search.

## Optional

- [LinkedIn](https://www.linkedin.com/company/citerank): Company updates from CiteRank.com.
- [X](https://x.com/tryciterank): Product updates and AI visibility insights.
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
