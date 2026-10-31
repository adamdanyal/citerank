import { createFileRoute } from "@tanstack/react-router";
import { CLOUD_APP_URL } from "@workspace/config/referrals";
import { canonicalUrl, SITE_NAME } from "@/lib/seo";

const catalog = {
	linkset: [
		{
			anchor: `${CLOUD_APP_URL}/api/v1`,
			"service-desc": [
				{
					href: canonicalUrl("/api/openapi.json"),
					type: "application/vnd.oai.openapi+json;version=3.1",
					title: `${SITE_NAME} API OpenAPI description`,
				},
			],
			"service-doc": [
				{
					href: canonicalUrl("/docs/api"),
					type: "text/html",
					title: `${SITE_NAME} API reference`,
				},
				{
					href: canonicalUrl("/docs/api.md"),
					type: "text/markdown",
					title: `${SITE_NAME} API reference (markdown)`,
				},
			],
		},
		{
			anchor: `${CLOUD_APP_URL}/api/mcp`,
			"service-doc": [
				{
					href: canonicalUrl("/docs/api/mcp"),
					type: "text/html",
					title: `${SITE_NAME} MCP server`,
				},
				{
					href: canonicalUrl("/docs/api/mcp.md"),
					type: "text/markdown",
					title: `${SITE_NAME} MCP server (markdown)`,
				},
			],
		},
	],
};

export const Route = createFileRoute("/.well-known/api-catalog")({
	server: {
		handlers: {
			GET: async () =>
				new Response(JSON.stringify(catalog), {
					headers: {
						"Content-Type": "application/linkset+json",
						"Access-Control-Allow-Origin": "*",
					},
				}),
		},
	},
});
