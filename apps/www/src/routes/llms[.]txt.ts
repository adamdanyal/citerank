import { createFileRoute } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD, PLANS } from "@workspace/config/plans";
import { productFeatures } from "@/data/features";
import { AGENCY_PLANS, formatUsd } from "@/lib/agency-plans";
import { SITE_URL } from "@/lib/seo";

const featureLinks = productFeatures
	.map((f) => `  - [${f.name}](${SITE_URL}/features/${f.slug}): ${f.summary}`)
	.join("\n");

// Curated llms.txt for the marketing site, following the llmstxt.org convention:
// an H1, a one-paragraph summary, a short positioning blurb, then sections of
// annotated links. The full text of the documentation lives at /llms-full.txt.
const llmsTxt = `# CiteRank.com

> CiteRank.com is an AI visibility tracker and AI search agency. Track how AI answer engines like ChatGPT, Google AI Overviews, Perplexity, Gemini, Bing AI Mode, and Grok talk about your brand: monitor mentions and sentiment, analyze citations, and benchmark competitors. Because CiteRank.com keeps every answer in full and bills month to month, you can check every number and you're never locked in.

CiteRank.com is answer engine optimization (AEO), also called generative engine optimization (GEO), without the black box. On a schedule, it runs your prompts across the AI apps you choose, then measures how often your brand appears, how the answers describe it, which competitors show up alongside it, and which sources the models cite. The methodology is documented and every answer is kept in full, so each number is something you can independently verify. About once a week it ranks what to do next, and the AI search agency does that work every month: new and updated pages, review sites and best-of lists, forum answers, guest articles on sites AI already cites, and crawler fixes, with a monthly report of the AI answers before and after. CiteRank.com is a trading name of Danx Digital Limited, registered in the United Kingdom, and was founded by Adam Danyal and Julia Danyal. Sign up for tracker plans from $${CLOUD_ENTRY_PRICE_USD}/month (Basic $${PLANS.basic.monthlyPriceUsd}, Pro $${PLANS.pro.monthlyPriceUsd}, Business $${PLANS.business.monthlyPriceUsd}, billed monthly, cancel any time), or book a call about the AI search agency, whose plans are ${AGENCY_PLANS.map((plan) => `${plan.name} ${formatUsd(plan.monthlyPriceUsd)}`).join(", ")} a month with a three-month minimum.

## Product

- [CiteRank.com](${SITE_URL}/): Know how AI talks about your brand: track visibility across 13 AI apps, monitor mentions, analyze citations, and benchmark competitors.
- [Features](${SITE_URL}/features): Visibility dashboard, per-prompt and per-model tracking, share of voice, sentiment analysis, query fan-out, citation analysis, ranked opportunities, prompt management, full responses, and long-term trends.
${featureLinks}
- [Pricing](${SITE_URL}/pricing): Self-serve tracker plans from $${CLOUD_ENTRY_PRICE_USD}/month, an AI search agency, and custom plans on request.
- [AI Search Agency](${SITE_URL}/agency): The team that does the work the tracker ranks, with a monthly before-and-after report.
- [About](${SITE_URL}/about): Company facts, founders, pricing, contract terms, and how the team works.
- [Support](${SITE_URL}/support): How to reach the team by email or a booked call, plus the LinkedIn community.

## Documentation

- [Documentation](${SITE_URL}/docs.md): Introduction to CiteRank.com, the AI visibility tracker and AI search agency.
- [Quick Start](${SITE_URL}/docs/getting-started.md): Sign up, choose a plan, add your brand, and read your first AI visibility results.
- [User Guide](${SITE_URL}/docs/user-guide.md): A complete walkthrough, from first login to daily visibility tracking, prompts, citations, competitors, and reports.
- [API Reference](${SITE_URL}/docs/api.md): Complete REST API documentation for CiteRank.com's public API.
- [MCP Server](${SITE_URL}/docs/api/mcp.md): Connect Claude Code, OpenCode, or another AI client to CiteRank.com over the Model Context Protocol.
- [llms-full.txt](${SITE_URL}/llms-full.txt): The full text of all CiteRank.com documentation in a single file.

## Resources

- [AI Visibility Tool Directory](${SITE_URL}/ai-visibility-tools): Compare 100+ AI visibility and answer engine optimization tools, with a feature matrix, pricing, and head-to-head comparisons with CiteRank.com.
- [Answer Engine Optimization](${SITE_URL}/answer-engine-optimization): What AEO is, how it differs from SEO, how AI answer engines decide what to cite, and what to measure.
- [Generative Engine Optimization](${SITE_URL}/generative-engine-optimization): What GEO means, how it differs from SEO and AEO, what the research says works, and how to measure it.
- [AI Search Guides](${SITE_URL}/ai-search): How ChatGPT, Perplexity, Google AI Overviews, and other AI engines choose what to cite.
- [AEO by Industry](${SITE_URL}/aeo-for): How answer engine optimization applies to 20 industries.
- [Blog](${SITE_URL}/blog): Research on how AI answer engines choose and cite sources.
- [AEO Glossary](${SITE_URL}/glossary): Definitions of the terms used in AI search.
- [AI Search Statistics](${SITE_URL}/statistics): Sourced statistics on AI search.

## Optional

- [X / Twitter](https://x.com/tryciterank): Product updates and AI visibility insights.
- [LinkedIn](https://www.linkedin.com/company/citerank): Company updates from CiteRank.com.
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
