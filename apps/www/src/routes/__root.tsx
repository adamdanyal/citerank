/// <reference types="vite/client" />

// Preload the 400-weight files used everywhere above the fold so they download
// in parallel with the CSS instead of after it (the H1 LCP element was being
// held back by the HTML→CSS→font waterfall).
import interFont from "@fontsource/inter/files/inter-latin-400-normal.woff2?url";
import schibstedFont from "@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-600-normal.woff2?url";
import { Asset, createRootRoute, Outlet, Scripts, useLocation, useTags } from "@tanstack/react-router";
import { initAdTags, trackAdPageView } from "@workspace/ui/lib/ad-tags";
import { isConsentRequired } from "@workspace/ui/lib/cookie-consent";
import { type ReactNode, useEffect } from "react";
import { AiReferralBanner } from "@/components/ai-referral-banner";
import { NotFound } from "@/components/not-found";
import { getConsentRegion } from "@/lib/consent-region";
import { initCrisp } from "@/lib/crisp";
import { initAnalytics } from "@/lib/posthog";
import { organizationJsonLd, SITE_DESCRIPTION, SITE_NAME, SITE_URL, websiteJsonLd } from "@/lib/seo";
import appCss from "../styles.css?url";

const ROOT_TITLE = `${SITE_NAME} · AI Visibility Tracker`;
/* The designed brand card; pages with their own title still get a generated card from /og.png. */
const ROOT_OG_IMAGE = `${SITE_URL}/og-home.png`;

export const Route = createRootRoute({
	notFoundComponent: NotFound,
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{ title: ROOT_TITLE },
			{ name: "description", content: SITE_DESCRIPTION },
			{ property: "og:site_name", content: SITE_NAME },
			{ property: "og:locale", content: "en_US" },
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: SITE_URL },
			{ property: "og:title", content: ROOT_TITLE },
			{ property: "og:description", content: SITE_DESCRIPTION },
			{ property: "og:image", content: ROOT_OG_IMAGE },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:alt", content: ROOT_TITLE },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: ROOT_TITLE },
			{ name: "twitter:description", content: SITE_DESCRIPTION },
			{ name: "twitter:image", content: ROOT_OG_IMAGE },
			{ name: "twitter:creator", content: "@tryciterank" },
			{ name: "theme-color", content: "#B84D25" },
			{ name: "apple-mobile-web-app-title", content: SITE_NAME },
		],
		links: [
			{
				rel: "preload",
				as: "font",
				type: "font/woff2",
				href: interFont,
				crossOrigin: "anonymous",
			},
			{
				rel: "preload",
				as: "font",
				type: "font/woff2",
				href: schibstedFont,
				crossOrigin: "anonymous",
			},
			{ rel: "icon", type: "image/svg+xml", href: "/icons/citerank-icon.svg" },
			{ rel: "icon", type: "image/png", sizes: "96x96", href: "/icons/citerank-icon-96.png" },
			{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
			{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
			{ rel: "manifest", href: "/site.webmanifest" },
			{ rel: "stylesheet", href: appCss },
		],
		scripts: [websiteJsonLd(), organizationJsonLd()],
	}),
	loader: async () => {
		const consentRegion = await getConsentRegion();
		return { consentRegion };
	},
	component: RootComponent,
});

function RootComponent() {
	const { consentRegion } = Route.useLoaderData();

	// No consent banner while CiteRank.com sets no analytics or ad cookies, so
	// where consent is required these stay off.
	useEffect(() => {
		const required = isConsentRequired(consentRegion);
		initCrisp();
		const stops = [initAnalytics(required), initAdTags(required)];
		return () => {
			for (const stop of stops) stop();
		};
	}, [consentRegion]);

	const pathname = useLocation({ select: (location) => location.pathname });
	useEffect(() => {
		trackAdPageView(pathname);
	}, [pathname]);

	return (
		<RootDocument>
			<AiReferralBanner />
			<Outlet />
		</RootDocument>
	);
}

// Pages are server-rendered, so hydration JS shouldn't compete with CSS, fonts, and images.
function PageHead() {
	return useTags().map((tag) => {
		const lowered = tag.tag === "link" && tag.attrs?.rel === "modulepreload";
		return (
			<Asset
				{...tag}
				attrs={lowered ? { ...tag.attrs, fetchPriority: "low" } : tag.attrs}
				key={`tsr-meta-${JSON.stringify(tag)}`}
			/>
		);
	});
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en" className="overflow-x-clip" suppressHydrationWarning>
			<head>
				<PageHead />
			</head>
			<body className="flex min-h-screen flex-col overflow-x-clip">
				{children}
				<Scripts />
			</body>
		</html>
	);
}
