import { CLOUD_PLATFORMS } from "@workspace/config/plans";

const ENGINE_COUNT = Object.keys(CLOUD_PLATFORMS).length;

/*
 * The two founders, with what each says in the closing of a page. The quotes
 * are the same length, name the company and state something a reader can check,
 * so an answer engine can lift either one whole. Portraits are 512px squares in public/.
 */
export const FOUNDERS = [
	{
		name: "Adam Danyal",
		role: "Founder",
		proof: "2M+ followers",
		href: "https://www.linkedin.com/in/adamdanyal/",
		photo: "/founder-adam.jpg",
		quote: `Ask AI which product to pick. It names two or three brands. There is no page two. CiteRank.com asks ${ENGINE_COUNT} AI tools your buyers’ questions four times a day, and shows you whether you were one of them.`,
	},
	{
		name: "Julia Danyal",
		role: "Co-founder",
		proof: "360K+ followers",
		href: "https://www.linkedin.com/in/juliadanyal/",
		photo: "/founder-julia.jpg",
		quote:
			"Tracking alone does not change an answer. So every month the CiteRank.com agency writes the pages AI is missing, asks the sites it trusts to list you, and shows you the answers before and after.",
	},
];
