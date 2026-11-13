/** Shared by the product and the marketing site so the two can't drift apart on a policy URL. */
import { MARKETING_SITE_URL } from "./referrals";
import type { DeploymentMode } from "./types";

const LEGAL_SITE_URL = MARKETING_SITE_URL;

interface LegalDocument {
	slug: string;
	title: string;
}

export const LEGAL_DOCUMENTS: readonly LegalDocument[] = [
	{ slug: "terms", title: "Terms of Service" },
	{ slug: "privacy", title: "Privacy Policy" },
	{ slug: "cookies", title: "Cookie Policy" },
	{ slug: "subprocessors", title: "Subprocessors" },
	{ slug: "acceptable-use", title: "Acceptable Use" },
];

export function legalUrl(slug: string): string {
	return `${LEGAL_SITE_URL}/legal/${slug}`;
}

/** Whitelabel deployments run under someone else's agreements, not ours. */
export function showsLegalLinks(mode: DeploymentMode | undefined): boolean {
	return mode === "cloud" || mode === "demo" || mode === "local";
}

/**
 * Self-hosted deployments are governed by whoever runs them, so only ours ask for cookie consent.
 * CiteRank.com sets no analytics or advertising cookies yet, so it asks nothing until it does.
 */
export function isElmoHosted(_mode: DeploymentMode | undefined): boolean {
	return false;
}
