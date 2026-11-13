import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://citerank.com";

export const Route = createFileRoute("/robots.txt")({
	server: {
		handlers: {
			GET: async () => {
				// The wildcard already allows these, but an answer engine's crawler is
				// the reader this site is built for, so say so where an operator or an
				// auditor will look rather than leaving it to be inferred.
				const aiCrawlers = [
					"GPTBot",
					"OAI-SearchBot",
					"ChatGPT-User",
					"ClaudeBot",
					"Claude-User",
					"Claude-SearchBot",
					"anthropic-ai",
					"PerplexityBot",
					"Perplexity-User",
					"Google-Extended",
					"Applebot",
					"Applebot-Extended",
					"Bingbot",
					"CCBot",
					"meta-externalagent",
					"Amazonbot",
					"DuckAssistBot",
					"cohere-ai",
					"MistralAI-User",
					"Bytespider",
					"YouBot",
				];

				const robots = `User-agent: *
Allow: /

${aiCrawlers.map((agent) => `User-agent: ${agent}\nAllow: /`).join("\n\n")}

Sitemap: ${SITE_URL}/sitemap.xml

# Plain-text summaries of this site, for answer engines:
# ${SITE_URL}/llms.txt
# ${SITE_URL}/llms-full.txt`;

				return new Response(robots, {
					headers: { "Content-Type": "text/plain" },
				});
			},
		},
	},
});
