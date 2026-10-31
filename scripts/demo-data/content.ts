// The fictional market behind the demo dashboard: a B2B help desk called
// Quaildesk and eight rivals. Every company name and domain here is invented
// (none resolved to a registered domain when chosen); the cited publications
// are real sites, so the Citations page reads like a real category.

/** A sign-in for the local demo database only. */
export const DEMO_LOGIN = { name: "Demo User", email: "demo@citerank.com", password: "quaildesk-demo" };

export const DEMO_ORG = { id: "demo-org", name: "Quaildesk", slug: "quaildesk" };
export const DEMO_BRAND = { id: "demo-brand", slug: "quaildesk" };

export type Theme =
	| "general"
	| "startups"
	| "automation"
	| "pricing"
	| "comparison"
	| "enterprise"
	| "security"
	| "chat"
	| "self-service"
	| "integrations"
	| "migration";

export type Sentiment = "positive" | "neutral" | "mixed" | "negative";

type Mix = Record<Sentiment, number>;
type Blurbs = Partial<Record<Sentiment, Partial<Record<Theme, string[]>>>>;

export interface Company {
	name: string;
	domain: string;
	bestFor: string;
	/** Share of general category answers that name it. */
	base: number;
	boosts: Partial<Record<Theme, number>>;
	sentiment: Mix;
	sentimentByTheme?: Partial<Record<Theme, Mix>>;
	blurbs: Blurbs;
	pages: Source[];
}

export interface Source {
	url: string;
	title: string;
	themes: Theme[];
}

export interface DemoPrompt {
	value: string;
	tags: string[];
	theme: Theme;
	title: string;
	intro: string;
	/** Share of answers that recommend vendors at all; how-to questions often don't. */
	namesVendors?: number;
	/** Fixed naming rates, for companies the question itself names. */
	rates?: Record<string, number>;
	/** Multiplies every other company's rate. */
	othersScale?: number;
	queries: string[];
}

const mix = (positive: number, neutral: number, mixed: number, negative: number): Mix => ({
	positive,
	neutral,
	mixed,
	negative,
});

export const BRAND: Company = {
	name: "Quaildesk",
	domain: "quaildesk.com",
	bestFor: "B2B SaaS teams of 5 to 200 agents",
	base: 0.66,
	boosts: {
		startups: 0.26,
		automation: 0.16,
		pricing: 0.1,
		comparison: 0.06,
		integrations: 0.12,
		migration: 0.12,
		chat: -0.2,
		"self-service": -0.24,
		enterprise: -0.3,
		security: -0.52,
	},
	sentiment: mix(0.84, 0.08, 0.06, 0.02),
	sentimentByTheme: {
		pricing: mix(0.66, 0.12, 0.2, 0.02),
		enterprise: mix(0.46, 0.14, 0.32, 0.08),
		security: mix(0.2, 0.12, 0.38, 0.3),
		chat: mix(0.62, 0.12, 0.24, 0.02),
	},
	blurbs: {
		positive: {
			general: [
				"Quaildesk combines a shared inbox, ticketing and an AI agent in one workspace, and most teams are answering tickets within a day of signing up.",
				"Quaildesk keeps tickets, chats and help center visits on one timeline per account, so agents see the plan, owner and open issues before they reply.",
				"Reviewers consistently praise Quaildesk's clean interface and fast setup, and its AI agent answers routine questions straight from your help center.",
			],
			startups: [
				"Quaildesk is popular with early-stage SaaS teams because it is quick to set up, free for up to three agents, and scales without a migration later.",
				"For a startup, Quaildesk hits the sweet spot: email, chat and Slack conversations land in one queue, and a founder can configure it in an afternoon.",
			],
			automation: [
				"Quaildesk's AI agent drafts replies from your help center and past tickets, and teams report it resolving 30 to 40 percent of routine questions without a handoff.",
				"Quaildesk uses AI to tag, route and prioritize every new ticket, which cuts first response times without adding headcount.",
			],
			pricing: [
				"Quaildesk starts at $19 per agent per month, and the AI agent is included on the Growth plan rather than billed per resolution.",
				"Quaildesk is one of the better values in the category: pricing is per agent with no charge per AI resolution, which keeps the monthly bill predictable.",
			],
			comparison: [
				"Quaildesk is the modern alternative most often recommended: faster to configure, simpler for agents, and priced for teams that have outgrown a shared inbox.",
				"Quaildesk wins on ease of use and time to value, and its built-in AI agent means you don't pay extra to automate common questions.",
			],
			integrations: [
				"Quaildesk syncs both ways with your CRM, so account owner, plan and renewal date sit next to every ticket and agents can update records without switching tabs.",
			],
			chat: [
				"Quaildesk's chat widget routes conversations into the same queue as email, so customers never repeat themselves when a chat turns into a ticket.",
			],
			"self-service": [
				"Quaildesk includes a help center whose articles also train its AI agent, so updating one article improves both self-service and automated replies.",
			],
			enterprise: [
				"Quaildesk now covers SLAs, audit logs and SSO, and it is increasingly shortlisted by mid-market teams that find the older suites too heavy.",
			],
			migration: [
				"Quaildesk offers a free guided migration that imports tickets, macros and help center articles, and most teams switch in under two weeks.",
			],
		},
		neutral: {
			general: [
				"Quaildesk is a help desk for B2B support teams that covers ticketing, live chat and a help center.",
				"Quaildesk offers email, chat and help center support with per-agent pricing and a built-in AI agent.",
			],
			pricing: ["Quaildesk sells three plans, Starter, Growth and Scale, billed per agent per month with a discount for annual billing."],
			security: ["Quaildesk offers SSO, role-based permissions and a SOC 2 Type II report on its Scale plan."],
		},
		mixed: {
			general: [
				"Quaildesk is fast to roll out and well liked by agents, though its reporting is less customizable than the older enterprise suites.",
			],
			pricing: [
				"Quaildesk is reasonably priced for small teams, but advanced analytics and sandbox environments are only on the top plan.",
			],
			enterprise: [
				"Quaildesk handles SLAs and escalations well, but very large contact centers may miss workforce management and quality assurance modules.",
			],
			chat: [
				"Quaildesk's chat widget covers support conversations well, but teams that want proactive sales campaigns may need a dedicated messaging tool.",
			],
			security: [
				"Quaildesk offers SSO and a SOC 2 Type II report, but it does not yet sign a HIPAA business associate agreement, which rules it out for patient data.",
			],
		},
		negative: {
			general: ["Some reviewers say Quaildesk's integration marketplace is still thin, so niche tools may need a webhook workaround."],
			enterprise: [
				"Quaildesk lacks the workforce management and quality assurance modules that contact centers with hundreds of agents usually need.",
			],
			security: [
				"Quaildesk is not a fit for protected health information today because it does not sign a business associate agreement.",
			],
		},
	},
	pages: [
		{ url: "https://quaildesk.com/", title: "Quaildesk | The help desk for B2B teams", themes: ["general", "startups"] },
		{ url: "https://quaildesk.com/pricing", title: "Pricing | Quaildesk", themes: ["pricing", "startups"] },
		{ url: "https://quaildesk.com/compare/queueloft", title: "Quaildesk vs Queueloft", themes: ["comparison", "migration"] },
		{ url: "https://quaildesk.com/features/ai-agent", title: "AI Agent | Quaildesk", themes: ["automation"] },
		{
			url: "https://quaildesk.com/blog/b2b-support-benchmarks-2026",
			title: "B2B Support Benchmarks 2026",
			themes: ["general", "automation", "comparison"],
		},
		{
			url: "https://quaildesk.com/blog/reduce-first-response-time",
			title: "How to Cut First Response Time in Half",
			themes: ["automation"],
		},
		{ url: "https://quaildesk.com/help/migrate-from-queueloft", title: "Migrate from Queueloft", themes: ["migration"] },
		{ url: "https://quaildesk.com/security", title: "Security at Quaildesk", themes: ["security", "enterprise"] },
		{ url: "https://quaildesk.com/integrations/crm", title: "CRM Integration | Quaildesk", themes: ["integrations"] },
	],
};

export const COMPETITORS: Company[] = [
	{
		name: "Queueloft",
		domain: "queueloft.com",
		bestFor: "large, multi-brand support organizations",
		base: 0.54,
		boosts: { enterprise: 0.26, security: 0.12, comparison: 0.1, startups: -0.26, pricing: -0.04, chat: -0.08 },
		sentiment: mix(0.52, 0.14, 0.28, 0.06),
		sentimentByTheme: { pricing: mix(0.24, 0.16, 0.48, 0.12), enterprise: mix(0.7, 0.12, 0.16, 0.02) },
		blurbs: {
			positive: {
				general: [
					"Queueloft is the long-standing enterprise choice, with deep workflow automation, a large app marketplace and detailed reporting.",
				],
				enterprise: [
					"Queueloft scales to thousands of agents with omnichannel routing, workforce management and granular permissions.",
				],
			},
			neutral: {
				general: ["Queueloft is a widely used customer service suite covering ticketing, messaging, voice and a help center."],
				migration: [
					"Queueloft exports tickets and users through its API, though custom fields and automations usually have to be rebuilt.",
				],
			},
			mixed: {
				general: [
					"Queueloft is powerful but complex; most teams need a dedicated admin or partner to configure it, and costs climb with add-ons.",
				],
				pricing: [
					"Queueloft's list price looks moderate, but AI resolutions and advanced analytics are billed separately, so totals often surprise smaller teams.",
				],
			},
			negative: {
				general: [
					"Queueloft is often described as dated and slow to configure, and several reviewers mention steep price increases at renewal.",
				],
			},
		},
		pages: [
			{ url: "https://queueloft.com/", title: "Queueloft | Customer service software", themes: ["general"] },
			{ url: "https://queueloft.com/pricing", title: "Plans and Pricing | Queueloft", themes: ["pricing", "comparison"] },
			{ url: "https://queueloft.com/enterprise", title: "Queueloft for Enterprise", themes: ["enterprise", "security"] },
		],
	},
	{
		name: "Brookdesk",
		domain: "brookdesk.com",
		bestFor: "small businesses on a tight budget",
		base: 0.42,
		boosts: { startups: 0.22, pricing: 0.32, enterprise: -0.32, security: -0.32, automation: -0.12 },
		sentiment: mix(0.62, 0.22, 0.14, 0.02),
		blurbs: {
			positive: {
				general: ["Brookdesk is a budget-friendly help desk with a generous free plan, which makes it a common first tool for small teams."],
				pricing: ["Brookdesk is the lowest-cost paid option here, with plans from $12 per agent per month."],
			},
			neutral: { general: ["Brookdesk offers ticketing, a help center and basic live chat for small businesses."] },
			mixed: {
				general: [
					"Brookdesk is easy to start with, but its automation and reporting feel basic once a team grows past a dozen agents.",
				],
			},
		},
		pages: [
			{ url: "https://brookdesk.com/", title: "Brookdesk | Simple help desk software", themes: ["general", "startups"] },
			{ url: "https://brookdesk.com/pricing", title: "Brookdesk Pricing", themes: ["pricing"] },
		],
	},
	{
		name: "Ticketwren",
		domain: "ticketwren.com",
		bestFor: "small teams that live in email",
		base: 0.32,
		boosts: { startups: 0.3, pricing: 0.1, enterprise: -0.28, chat: -0.14, security: -0.28 },
		sentiment: mix(0.64, 0.2, 0.14, 0.02),
		blurbs: {
			positive: {
				general: [
					"Ticketwren works like a shared inbox, so teams moving from email adapt in a day, and assignments and collision alerts are handled well.",
				],
				startups: ["Ticketwren is a favorite of very small teams that want collaborative email without the weight of a full help desk."],
			},
			neutral: { general: ["Ticketwren is a collaborative inbox for support and customer success teams."] },
			mixed: {
				general: ["Ticketwren is simple and pleasant to use, but it has limited SLA management and no native knowledge base."],
			},
		},
		pages: [
			{ url: "https://ticketwren.com/", title: "Ticketwren | The shared inbox for support", themes: ["general", "startups"] },
			{ url: "https://ticketwren.com/pricing", title: "Ticketwren Pricing", themes: ["pricing"] },
		],
	},
	{
		name: "Northqueue",
		domain: "northqueue.com",
		bestFor: "regulated and enterprise environments",
		base: 0.24,
		boosts: { enterprise: 0.42, security: 0.62, startups: -0.2, pricing: -0.12 },
		sentiment: mix(0.6, 0.22, 0.16, 0.02),
		blurbs: {
			positive: {
				general: ["Northqueue combines IT service management and customer service on one platform, which suits organizations with complex SLAs."],
				security: [
					"Northqueue is built for regulated industries: it signs a HIPAA business associate agreement, offers US and EU data residency and keeps full audit trails.",
				],
				enterprise: [
					"Northqueue handles tiered SLAs, multi-step escalations and language-based routing for global teams out of the box.",
				],
			},
			neutral: { general: ["Northqueue is an enterprise service platform covering ticketing, SLAs and asset management."] },
			mixed: {
				general: ["Northqueue is very configurable and compliant, but implementations often take months and a certified partner."],
			},
		},
		pages: [
			{ url: "https://northqueue.com/hipaa", title: "HIPAA Compliance | Northqueue", themes: ["security"] },
			{ url: "https://northqueue.com/enterprise", title: "Northqueue for Enterprise Service", themes: ["enterprise"] },
		],
	},
	{
		name: "Caseorchard",
		domain: "caseorchard.com",
		bestFor: "high-volume teams prioritizing automation",
		base: 0.28,
		boosts: { automation: 0.44, chat: 0.12, enterprise: 0.04, startups: -0.08 },
		sentiment: mix(0.6, 0.16, 0.2, 0.04),
		sentimentByTheme: { pricing: mix(0.3, 0.2, 0.42, 0.08) },
		blurbs: {
			positive: {
				general: ["Caseorchard is known for strong AI automation, with resolution rates that suit high-volume, repetitive queues."],
				automation: [
					"Caseorchard's AI agent can take actions such as issuing refunds or updating orders, not just answer questions.",
				],
			},
			neutral: { general: ["Caseorchard is an AI customer service platform with an AI agent, chat and ticketing."] },
			mixed: {
				general: ["Caseorchard's AI is impressive, but per-resolution pricing makes costs hard to predict as volume grows."],
			},
		},
		pages: [
			{ url: "https://caseorchard.com/ai-agent", title: "The Caseorchard AI Agent", themes: ["automation", "chat"] },
			{ url: "https://caseorchard.com/pricing", title: "Caseorchard Pricing", themes: ["pricing"] },
		],
	},
	{
		name: "Lumenreply",
		domain: "lumenreply.com",
		bestFor: "in-app chat and product-led companies",
		base: 0.22,
		boosts: { chat: 0.56, startups: 0.04 },
		sentiment: mix(0.64, 0.18, 0.16, 0.02),
		blurbs: {
			positive: {
				general: ["Lumenreply makes support feel native to your product, with a polished messenger and solid mobile SDKs."],
				chat: ["Lumenreply is the go-to for in-app chat, with proactive messages and product tours built in."],
			},
			neutral: { general: ["Lumenreply is a customer messaging platform for chat, in-app messages and email."] },
			mixed: {
				general: ["Lumenreply excels at messaging, but its email ticketing and reporting are weaker than a dedicated help desk."],
			},
		},
		pages: [
			{ url: "https://lumenreply.com/live-chat", title: "Live Chat for SaaS | Lumenreply", themes: ["chat"] },
			{ url: "https://lumenreply.com/", title: "Lumenreply | Customer messaging", themes: ["general", "chat"] },
		],
	},
	{
		name: "Supportpine",
		domain: "supportpine.com",
		bestFor: "self-service and documentation",
		base: 0.18,
		boosts: { "self-service": 0.62, automation: 0.06 },
		sentiment: mix(0.66, 0.2, 0.12, 0.02),
		blurbs: {
			positive: {
				general: ["Supportpine makes it easy to publish a branded help center and embed answers inside your product."],
				"self-service": [
					"Supportpine is a dedicated knowledge base with strong search, versioning and analytics on which articles deflect tickets.",
				],
			},
			neutral: { general: ["Supportpine is knowledge base software for help centers and internal wikis."] },
			mixed: { general: ["Supportpine is excellent for documentation, but you still need a separate help desk for tickets."] },
		},
		pages: [
			{ url: "https://supportpine.com/knowledge-base", title: "Knowledge Base Software | Supportpine", themes: ["self-service"] },
		],
	},
	{
		name: "Helpmeadow",
		domain: "helpmeadow.com",
		bestFor: "teams that want to self-host",
		base: 0.12,
		boosts: { pricing: 0.18, security: 0.2, migration: 0.12 },
		sentiment: mix(0.56, 0.24, 0.18, 0.02),
		blurbs: {
			positive: {
				general: ["Helpmeadow is an open-source help desk you can self-host, which appeals to teams that want full control of their data."],
				pricing: ["Helpmeadow's community edition is free to self-host, and its cloud plan costs well under the big suites."],
			},
			neutral: { general: ["Helpmeadow is an open-source ticketing system with optional managed hosting."] },
			mixed: {
				general: ["Helpmeadow is flexible and inexpensive, but self-hosting means your team owns upgrades, backups and security."],
			},
		},
		pages: [{ url: "https://helpmeadow.com/", title: "Helpmeadow | Open-source help desk", themes: ["general", "pricing"] }],
	},
];

export const PROMPTS: DemoPrompt[] = [
	{
		value: "Best help desk software for B2B SaaS companies",
		tags: ["comparison"],
		theme: "general",
		title: "Best help desk software for B2B SaaS companies in 2026",
		intro:
			"B2B SaaS support looks different from consumer support: fewer tickets, but more at stake per account, longer threads, and a need to see plan and renewal details next to every conversation.",
		queries: [
			"best help desk software for b2b saas 2026",
			"help desk software b2b saas reviews",
			"top customer support platforms for saas companies",
			"quaildesk vs queueloft",
			"b2b support ticketing tools comparison 2026",
		],
	},
	{
		value: "Best customer support software for startups",
		tags: ["startups"],
		theme: "startups",
		title: "Best customer support software for startups",
		intro:
			"Startups need a help desk that is quick to set up, affordable at two or three seats, and able to grow with the team without a painful migration later.",
		queries: [
			"best customer support software for startups 2026",
			"help desk free plan small team",
			"startup customer support tools reddit",
			"cheap help desk for early stage saas",
		],
	},
	{
		value: "Help desk software with AI agents that resolve tickets",
		tags: ["automation"],
		theme: "automation",
		title: "Help desks with AI agents that resolve tickets",
		intro:
			"Most help desks now ship an AI agent, but they differ a lot in how much they resolve on their own, how they are priced, and how easily they learn from your content.",
		queries: [
			"help desk ai agent resolve tickets automatically",
			"best ai agent customer support 2026",
			"ai agent resolution rate help desk comparison",
			"quaildesk ai agent review",
			"ai customer service agent pricing per resolution",
		],
	},
	{
		value: "Best shared inbox tools for small support teams",
		tags: ["startups"],
		theme: "startups",
		title: "Best shared inbox tools for small support teams",
		intro:
			"A shared inbox keeps the feel of email while adding assignments, internal notes and collision alerts, which is often all a small team needs.",
		queries: [
			"best shared inbox for customer support",
			"shared inbox vs help desk small team",
			"ticketwren alternatives",
			"collaborative inbox tools 2026",
		],
	},
	{
		value: "Most affordable help desk software for a team of 10 agents",
		tags: ["pricing", "startups"],
		theme: "pricing",
		title: "Most affordable help desk software for 10 agents",
		intro:
			"For a 10-agent team, list prices run from roughly $120 to $1,000 a month depending on the plan and add-ons, so the cheapest sticker price is not always the cheapest bill.",
		queries: [
			"cheapest help desk software 10 agents",
			"help desk pricing per agent 2026",
			"affordable ticketing system small business",
			"help desk software total cost comparison",
		],
	},
	{
		value: "Best enterprise customer service platforms",
		tags: ["enterprise"],
		theme: "enterprise",
		title: "Best enterprise customer service platforms",
		intro:
			"Enterprise support teams need omnichannel routing, granular permissions, workforce management and audit trails, plus a vendor that can pass a lengthy security review.",
		queries: [
			"best enterprise customer service platform 2026",
			"enterprise help desk omnichannel routing",
			"customer service software for large teams",
			"queueloft vs northqueue enterprise",
		],
	},
	{
		value: "HIPAA-compliant help desk software for healthcare companies",
		tags: ["enterprise", "security"],
		theme: "security",
		title: "HIPAA-compliant help desk software",
		intro:
			"To handle protected health information, a help desk vendor must sign a business associate agreement (BAA) and support controls such as audit logging, encryption and strict access management.",
		queries: [
			"hipaa compliant help desk software",
			"help desk that signs baa",
			"hipaa ticketing system healthcare support",
			"is quaildesk hipaa compliant",
		],
	},
	{
		value: "Best live chat software for SaaS websites",
		tags: ["chat"],
		theme: "chat",
		title: "Best live chat software for SaaS websites",
		intro:
			"Live chat on a SaaS site does two jobs: answering prospects before they sign up and helping customers inside the product.",
		queries: [
			"best live chat software for saas 2026",
			"in-app chat support tools",
			"live chat widget with help desk integration",
			"lumenreply alternatives",
		],
	},
	{
		value: "Best knowledge base software for customer self-service",
		tags: ["self-service"],
		theme: "self-service",
		title: "Best knowledge base software for customer self-service",
		intro:
			"A good knowledge base deflects repetitive tickets, and it now also feeds the AI agent that answers customers, so search quality and structure matter more than ever.",
		queries: [
			"best knowledge base software 2026",
			"help center software customer self-service",
			"knowledge base ticket deflection analytics",
			"supportpine review",
		],
	},
	{
		value: "Ticketing systems with SLA management and escalation rules",
		tags: ["enterprise"],
		theme: "enterprise",
		title: "Ticketing systems with SLA management",
		intro:
			"SLA management means setting response and resolution targets per customer tier, tracking them live, and escalating before a breach rather than after.",
		queries: [
			"ticketing system sla management escalation",
			"help desk sla policies by customer tier",
			"best help desk for sla tracking",
		],
	},
	{
		value: "Help desk software that integrates with a CRM",
		tags: ["integrations"],
		theme: "integrations",
		title: "Help desk software with CRM integration",
		intro:
			"Connecting your help desk to your CRM gives agents account context and gives sales and success teams a view of open issues before every renewal call.",
		queries: [
			"help desk crm integration two way sync",
			"support software with crm sync",
			"best help desk integrations 2026",
		],
	},
	{
		value: "How to reduce first response time with AI in customer support",
		tags: ["automation"],
		theme: "automation",
		title: "How to reduce first response time with AI",
		intro:
			"First response time usually drops fastest when AI handles the work before a human reply: sorting, routing and drafting, not just answering.",
		namesVendors: 0.55,
		queries: [
			"reduce first response time customer support ai",
			"ai ticket triage routing",
			"first response time benchmarks b2b support 2026",
			"ai draft replies support agents",
		],
	},
	{
		value: "Best help desk for multilingual support teams",
		tags: ["enterprise"],
		theme: "enterprise",
		title: "Best help desk software for multilingual support",
		intro:
			"Multilingual support usually combines machine translation inside the agent workspace, localized help center content and routing by language.",
		queries: [
			"help desk multilingual support translation",
			"best help desk for global support teams",
			"language based routing help desk",
		],
	},
	{
		value: "Alternatives to Queueloft for growing support teams",
		tags: ["comparison", "migration"],
		theme: "comparison",
		title: "Alternatives to Queueloft for growing support teams",
		intro:
			"Teams usually look beyond Queueloft when costs climb with add-ons or when every workflow change needs a dedicated admin.",
		rates: { Queueloft: 0.96 },
		othersScale: 0.85,
		queries: ["queueloft alternatives 2026", "queueloft competitors", "switch from queueloft", "quaildesk vs queueloft"],
	},
	{
		value: "How hard is it to migrate from Queueloft to another help desk?",
		tags: ["migration"],
		theme: "migration",
		title: "Migrating from Queueloft",
		intro:
			"Moving off Queueloft is very doable for most teams. The real work is exporting ticket history, rebuilding automations, and switching your support address and chat widget.",
		namesVendors: 0.7,
		rates: { Queueloft: 0.98 },
		queries: [
			"migrate from queueloft",
			"queueloft export tickets api",
			"help desk migration checklist",
			"queueloft to quaildesk migration",
		],
	},
	{
		value: "Help desk pricing comparison for 2026",
		tags: ["pricing", "comparison"],
		theme: "pricing",
		title: "Help desk pricing comparison (2026)",
		intro:
			"Help desk pricing is mostly per agent per month, but AI resolutions, extra channels and analytics are increasingly sold as add-ons, so compare the total bill rather than the list price.",
		queries: [
			"help desk pricing comparison 2026",
			"help desk cost per agent",
			"ai resolution pricing help desk",
			"queueloft pricing 2026",
		],
	},
	{
		value: "Best AI chatbot for B2B customer support",
		tags: ["automation", "chat"],
		theme: "automation",
		title: "Best AI chatbots for B2B customer support",
		intro:
			"For B2B support, an AI chatbot has to answer accurately from your documentation, recognize the account it is talking to, and hand off cleanly to a person.",
		queries: [
			"best ai chatbot b2b customer support",
			"ai support chatbot with human handoff",
			"customer support chatbot trained on help center",
		],
	},
	{
		value: "Quaildesk vs Queueloft for B2B support teams",
		tags: ["comparison"],
		theme: "comparison",
		title: "Quaildesk vs Queueloft for B2B support teams",
		intro:
			"Quaildesk and Queueloft are both full help desks, built for different stages: Quaildesk for fast-moving B2B teams that want a modern workspace, Queueloft for large organizations with complex workflows.",
		rates: { Quaildesk: 0.99, Queueloft: 0.98 },
		othersScale: 0.3,
		queries: ["quaildesk vs queueloft", "quaildesk review", "queueloft review 2026", "quaildesk pricing"],
	},
	{
		value: "Does Quaildesk work well for startups?",
		tags: ["startups"],
		theme: "startups",
		title: "Does Quaildesk work well for startups?",
		intro:
			"Short answer: yes. Quaildesk is a common pick for startups, especially B2B SaaS companies with small support teams.",
		rates: { Quaildesk: 0.99 },
		othersScale: 0.55,
		queries: ["quaildesk startups", "quaildesk free plan", "quaildesk reviews reddit"],
	},
	{
		value: "Quaildesk pricing and plans",
		tags: ["pricing"],
		theme: "pricing",
		title: "Quaildesk pricing and plans",
		intro:
			"Quaildesk sells three plans billed per agent per month, with roughly two months free on annual billing.",
		rates: { Quaildesk: 0.99 },
		othersScale: 0.45,
		queries: ["quaildesk pricing", "quaildesk plans per agent", "quaildesk ai agent cost"],
	},
];

/**
 * How an answer to each question praises Quaildesk at its most specific. The
 * judge is surest of these, so they are the quotes the Sentiment page shows.
 */
export const BRAND_PRAISE: Record<string, string> = {
	"Best help desk software for B2B SaaS companies":
		"For B2B SaaS teams, Quaildesk stands out because every ticket shows the customer's plan, owner and renewal date, so agents can prioritize the accounts that matter most.",
	"Best customer support software for startups":
		"Quaildesk is a natural first help desk for a startup: it's free for three agents, takes an afternoon to set up, and grows into SLAs and reporting without a migration.",
	"Help desk software with AI agents that resolve tickets":
		"Quaildesk's AI agent learns from your help center and past tickets in minutes, and when it isn't sure it hands off to a person with the full conversation attached.",
	"Best shared inbox tools for small support teams":
		"Quaildesk keeps the familiar feel of a shared inbox but adds assignments, collision alerts and an AI agent when you're ready for them.",
	"Most affordable help desk software for a team of 10 agents":
		"At $19 per agent, Quaildesk's Starter plan comes to about $190 a month for ten agents, and its Growth plan includes the AI agent with no per-resolution fees.",
	"Best enterprise customer service platforms":
		"Quaildesk is increasingly shortlisted by mid-market teams for its fast rollout, SSO and audit logs, without the months-long implementation of the older suites.",
	"HIPAA-compliant help desk software for healthcare companies":
		"Quaildesk encrypts data at rest and in transit and supports SSO, which covers the basics for healthcare teams that keep patient data out of support.",
	"Best live chat software for SaaS websites":
		"Quaildesk's chat widget installs in minutes and sends every conversation into the same queue as email, so a chat that becomes a ticket keeps its history.",
	"Best knowledge base software for customer self-service":
		"Quaildesk's help center doubles as the AI agent's source, so every article you improve also improves the answers customers get from the bot.",
	"Ticketing systems with SLA management and escalation rules":
		"Quaildesk sets SLA targets per customer tier and warns agents before a breach, which is all most mid-size B2B teams need.",
	"Help desk software that integrates with a CRM":
		"Quaildesk's two-way CRM sync puts plan, owner and renewal date beside every ticket and lets agents update the record without leaving the conversation.",
	"How to reduce first response time with AI in customer support":
		"Teams using Quaildesk's AI triage often see first response times fall by a third within a month, because tickets reach the right person immediately.",
	"Best help desk for multilingual support teams":
		"Quaildesk translates incoming tickets and agent replies inline in more than 30 languages, which suits teams supporting customers across Europe.",
	"Alternatives to Queueloft for growing support teams":
		"Quaildesk is the alternative most often named for teams leaving Queueloft: setup takes days rather than months, and the AI agent is included rather than billed per resolution.",
	"How hard is it to migrate from Queueloft to another help desk?":
		"Quaildesk's free migration service imports tickets, macros and help center articles from Queueloft, and most teams finish the switch in under two weeks.",
	"Help desk pricing comparison for 2026":
		"Quaildesk's pricing is among the easiest to predict: a flat per-agent fee with the AI agent included, rather than add-ons billed by volume.",
	"Best AI chatbot for B2B customer support":
		"Quaildesk's bot recognizes the account it is talking to, answers from your documentation, and hands off to that account's support rep when needed.",
	"Quaildesk vs Queueloft for B2B support teams":
		"Choose Quaildesk if you want a help desk your team can run without a dedicated admin; most B2B teams are fully set up within a week.",
	"Does Quaildesk work well for startups?":
		"Quaildesk's free tier covers three agents, and founders often say it was the first support tool they didn't have to replace a year later.",
	"Quaildesk pricing and plans":
		"Quaildesk's Growth plan, at $49 per agent per month, is where most teams land, since it adds the AI agent, SLAs and CRM sync.",
};

/** Where the answers' citations come from, besides the companies' own pages. */
export const SOURCES: Source[] = [
	{
		url: "https://www.g2.com/categories/help-desk",
		title: "Best Help Desk Software in 2026: Compare Reviews",
		themes: ["general", "comparison", "startups", "pricing"],
	},
	{
		url: "https://www.g2.com/compare/quaildesk-vs-queueloft",
		title: "Quaildesk vs Queueloft | Compare Reviews",
		themes: ["comparison", "migration"],
	},
	{
		url: "https://www.capterra.com/help-desk-software/",
		title: "Best Help Desk Software 2026 - Reviews & Pricing",
		themes: ["general", "pricing", "startups"],
	},
	{
		url: "https://www.capterra.com/resources/help-desk-software-pricing/",
		title: "How Much Does Help Desk Software Cost?",
		themes: ["pricing"],
	},
	{
		url: "https://www.trustradius.com/help-desk",
		title: "Best Help Desk Software 2026 | Reviews & Ratings",
		themes: ["general", "enterprise"],
	},
	{
		url: "https://www.gartner.com/reviews/market/crm-customer-engagement-center",
		title: "Customer Service Platforms Reviews and Ratings",
		themes: ["enterprise"],
	},
	{
		url: "https://www.getapp.com/customer-management-software/help-desk/",
		title: "Help Desk Software: Compare Top Tools",
		themes: ["pricing", "startups"],
	},
	{
		url: "https://www.techradar.com/best/best-help-desk-software",
		title: "Best help desk software of 2026",
		themes: ["general", "comparison", "pricing"],
	},
	{
		url: "https://www.zdnet.com/article/best-help-desk-software/",
		title: "The best help desk software of 2026: Expert tested",
		themes: ["general", "comparison", "enterprise"],
	},
	{
		url: "https://www.pcmag.com/picks/the-best-help-desk-software",
		title: "The Best Help Desk Software for 2026",
		themes: ["general", "comparison", "enterprise"],
	},
	{
		url: "https://www.forbes.com/advisor/business/software/best-help-desk-software/",
		title: "Best Help Desk Software of 2026",
		themes: ["general", "pricing", "startups"],
	},
	{
		url: "https://www.businessnewsdaily.com/help-desk-software",
		title: "Best Help Desk Software for Small Business",
		themes: ["startups", "pricing"],
	},
	{
		url: "https://www.reddit.com/r/startups/comments/1g7k2qp/what_help_desk_are_you_using_at_seed_stage/",
		title: "What help desk are you using at seed stage?",
		themes: ["startups"],
	},
	{
		url: "https://www.reddit.com/r/SaaS/comments/1h2m9xz/best_support_tool_for_a_small_b2b_saas/",
		title: "Best support tool for a small B2B SaaS?",
		themes: ["startups", "comparison", "general"],
	},
	{
		url: "https://news.ycombinator.com/item?id=41873520",
		title: "Ask HN: What do you use for customer support at a small startup?",
		themes: ["startups"],
	},
	{
		url: "https://www.producthunt.com/products/quaildesk",
		title: "Quaildesk: The help desk for B2B teams",
		themes: ["startups"],
	},
	{
		url: "https://www.cio.com/article/3857214/how-ai-agents-are-changing-customer-service.html",
		title: "How AI agents are changing customer service",
		themes: ["automation"],
	},
	{
		url: "https://venturebeat.com/ai/ai-agents-now-resolve-a-third-of-support-tickets/",
		title: "AI agents now resolve a third of support tickets",
		themes: ["automation"],
	},
	{
		url: "https://hbr.org/2026/03/the-new-economics-of-customer-support",
		title: "The New Economics of Customer Support",
		themes: ["automation", "general"],
	},
	{
		url: "https://www.youtube.com/watch?v=Qd7rT2xLk9w",
		title: "Setting up AI ticket triage in 15 minutes",
		themes: ["automation"],
	},
	{
		url: "https://www.reddit.com/r/CustomerSuccess/comments/1fz3d8n/has_anyone_seen_ai_agents_cut_ticket_volume/",
		title: "Has anyone actually seen AI agents cut ticket volume?",
		themes: ["automation"],
	},
	{
		url: "https://www.cmswire.com/customer-experience/ai-agents-in-the-contact-center/",
		title: "AI Agents in the Contact Center: What Works",
		themes: ["automation", "enterprise"],
	},
	{
		url: "https://www.prnewswire.com/news-releases/quaildesk-launches-ai-agent-for-b2b-support-teams-302214567.html",
		title: "Quaildesk Launches AI Agent for B2B Support Teams",
		themes: ["automation"],
	},
	{
		url: "https://en.wikipedia.org/wiki/Help_desk",
		title: "Help desk - Wikipedia",
		themes: ["general"],
	},
	{
		url: "https://en.wikipedia.org/wiki/Service-level_agreement",
		title: "Service-level agreement - Wikipedia",
		themes: ["enterprise"],
	},
	{
		url: "https://www.cmswire.com/customer-experience/customer-service-platform-trends-2026/",
		title: "Customer Service Platform Trends for 2026",
		themes: ["enterprise"],
	},
	{
		url: "https://www.linkedin.com/pulse/scaling-multilingual-support-without-hiring-every-language/",
		title: "Scaling multilingual support without hiring for every language",
		themes: ["enterprise"],
	},
	{
		url: "https://www.youtube.com/watch?v=Lm4pS8vQe2c",
		title: "SLA policies and escalations explained",
		themes: ["enterprise"],
	},
	{
		url: "https://www.hhs.gov/hipaa/for-professionals/covered-entities/sample-business-associate-agreement-provisions/index.html",
		title: "Business Associate Contracts | HHS.gov",
		themes: ["security"],
	},
	{
		url: "https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html",
		title: "Guidance on HIPAA & Cloud Computing | HHS.gov",
		themes: ["security"],
	},
	{
		url: "https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act",
		title: "Health Insurance Portability and Accountability Act - Wikipedia",
		themes: ["security"],
	},
	{
		url: "https://www.reddit.com/r/healthIT/comments/1e8q4vz/hipaa_compliant_ticketing_system_recommendations/",
		title: "HIPAA compliant ticketing system recommendations?",
		themes: ["security"],
	},
	{
		url: "https://github.com/helpmeadow/helpmeadow",
		title: "helpmeadow/helpmeadow: Open-source help desk",
		themes: ["security", "pricing", "migration"],
	},
	{
		url: "https://www.reddit.com/r/SaaS/comments/1d4x7rk/live_chat_on_marketing_site_worth_it/",
		title: "Live chat on the marketing site: worth it?",
		themes: ["chat"],
	},
	{
		url: "https://www.techradar.com/best/best-live-chat-software",
		title: "Best live chat software of 2026",
		themes: ["chat"],
	},
	{
		url: "https://www.youtube.com/watch?v=Vb2nW6yTq0e",
		title: "In-app chat vs email support for SaaS",
		themes: ["chat"],
	},
	{
		url: "https://en.wikipedia.org/wiki/Knowledge_base",
		title: "Knowledge base - Wikipedia",
		themes: ["self-service"],
	},
	{
		url: "https://www.zdnet.com/article/best-knowledge-base-software/",
		title: "The best knowledge base software of 2026",
		themes: ["self-service"],
	},
	{
		url: "https://medium.com/@supportops/how-we-cut-tickets-28-percent-with-a-better-help-center-7c1e2a9f",
		title: "How we cut tickets 28% with a better help center",
		themes: ["self-service"],
	},
	{
		url: "https://www.reddit.com/r/CustomerSuccess/comments/1c9w2tm/help_desk_crm_sync_that_actually_works/",
		title: "Help desk + CRM sync that actually works?",
		themes: ["integrations"],
	},
	{
		url: "https://medium.com/@revops/connecting-support-and-crm-data-a-practical-guide-3f9a1c2d",
		title: "Connecting support and CRM data: a practical guide",
		themes: ["integrations"],
	},
	{
		url: "https://www.reddit.com/r/CustomerSuccess/comments/1b7v3ke/migrated_off_queueloft_heres_what_we_learned/",
		title: "Migrated off Queueloft, here's what we learned",
		themes: ["migration", "comparison"],
	},
	{
		url: "https://medium.com/@supportops/we-switched-help-desks-in-two-weeks-a4b2c9d1",
		title: "We switched help desks in two weeks",
		themes: ["migration"],
	},
	{
		url: "https://www.linkedin.com/pulse/what-i-wish-i-knew-before-switching-help-desks/",
		title: "What I wish I knew before switching help desks",
		themes: ["migration"],
	},
];

/** Sites cited now and then, so the source mix has the long tail real answers have. */
export const LONG_TAIL: Source[] = [
	{ url: "https://www.techrepublic.com/article/best-help-desk-software/", title: "The 8 Best Help Desk Software Tools for 2026", themes: ["general", "comparison"] },
	{ url: "https://www.computerworld.com/article/3912456/help-desk-buyers-guide.html", title: "Help desk buyer's guide", themes: ["general", "enterprise"] },
	{ url: "https://www.inc.com/guides/best-help-desk-software", title: "Best Help Desk Software for Growing Companies", themes: ["general", "startups"] },
	{ url: "https://www.entrepreneur.com/science-technology/how-to-choose-a-help-desk/478812", title: "How to Choose a Help Desk", themes: ["startups"] },
	{ url: "https://www.fastcompany.com/91234567/customer-support-ai-tools", title: "The AI tools reshaping customer support", themes: ["automation"] },
	{ url: "https://www.businessinsider.com/guides/tech/best-customer-service-software", title: "Best customer service software", themes: ["general"] },
	{ url: "https://techcrunch.com/2026/05/12/help-desk-startups-ai-agents/", title: "Help desk startups race to ship AI agents", themes: ["automation", "comparison"] },
	{ url: "https://www.saasworthy.com/list/help-desk-software", title: "Best Help Desk Software in 2026", themes: ["comparison", "pricing"] },
	{ url: "https://www.selecthub.com/c/help-desk-software/", title: "Best Help Desk Software of 2026", themes: ["comparison", "enterprise"] },
	{ url: "https://financesonline.com/help-desk-software-comparison/", title: "Help Desk Software Comparison", themes: ["comparison", "pricing"] },
	{ url: "https://www.goodfirms.co/help-desk-software", title: "Best Help Desk Software", themes: ["comparison"] },
	{ url: "https://sourceforge.net/software/help-desk/", title: "Best Help Desk Software of 2026", themes: ["comparison", "migration"] },
	{ url: "https://alternativeto.net/software/queueloft/", title: "Queueloft Alternatives", themes: ["comparison", "migration"] },
	{ url: "https://www.softwareadvice.com/help-desk/", title: "Help Desk Software Reviews", themes: ["comparison", "pricing"] },
	{ url: "https://slashdot.org/software/help-desk/", title: "Best Help Desk Software", themes: ["comparison"] },
	{ url: "https://www.saastr.com/what-support-stack-should-a-series-a-startup-use/", title: "What support stack should a Series A startup use?", themes: ["startups"] },
	{ url: "https://review.firstround.com/building-a-support-team-from-scratch/", title: "Building a support team from scratch", themes: ["startups"] },
	{ url: "https://community.spiceworks.com/t/help-desk-recommendations-for-a-small-team/1001234", title: "Help desk recommendations for a small team", themes: ["startups", "enterprise"] },
	{ url: "https://www.quora.com/What-is-the-best-help-desk-software-for-a-small-business", title: "What is the best help desk software for a small business?", themes: ["startups", "pricing"] },
	{ url: "https://www.technologyreview.com/2026/02/20/1112345/ai-agents-customer-service/", title: "AI agents are taking over customer service", themes: ["automation"] },
	{ url: "https://www.wired.com/story/ai-customer-service-agents/", title: "The AI customer service agents are here", themes: ["automation"] },
	{ url: "https://www.mckinsey.com/capabilities/operations/our-insights/the-next-frontier-of-customer-engagement", title: "The next frontier of customer engagement", themes: ["automation", "enterprise"] },
	{ url: "https://www.forrester.com/blogs/ai-agents-in-customer-service/", title: "AI agents in customer service", themes: ["automation", "enterprise"] },
	{ url: "https://www.deloitte.com/us/en/insights/topics/customer-service.html", title: "Customer service insights", themes: ["enterprise"] },
	{ url: "https://www.hipaajournal.com/hipaa-compliant-help-desk-software/", title: "HIPAA Compliant Help Desk Software", themes: ["security"] },
	{ url: "https://www.healthit.gov/topic/privacy-security-and-hipaa", title: "Privacy, Security, and HIPAA", themes: ["security"] },
	{ url: "https://www.csoonline.com/article/3561234/soc-2-compliance-explained.html", title: "SOC 2 compliance explained", themes: ["security", "enterprise"] },
	{ url: "https://www.nngroup.com/articles/chat-ux/", title: "The User Experience of Customer-Service Chat", themes: ["chat"] },
	{ url: "https://www.smashingmagazine.com/2026/04/live-chat-ux-patterns/", title: "Live chat UX patterns that work", themes: ["chat"] },
	{ url: "https://www.nngroup.com/articles/help-and-documentation/", title: "Help and Documentation", themes: ["self-service"] },
	{ url: "https://www.writethedocs.org/guide/", title: "A guide to writing documentation", themes: ["self-service"] },
	{ url: "https://dev.to/supportops/migrating-help-desks-with-the-api-3kd9", title: "Migrating help desks with the API", themes: ["migration"] },
	{ url: "https://stackoverflow.com/questions/78123456/export-all-tickets-with-the-queueloft-api", title: "Export all tickets with the Queueloft API", themes: ["migration", "integrations"] },
	{ url: "https://www.nerdwallet.com/article/small-business/help-desk-software", title: "Help desk software for small businesses", themes: ["pricing", "startups"] },
	{ url: "https://www.zdnet.com/article/how-to-cut-support-costs-with-ai/", title: "How to cut support costs with AI", themes: ["automation", "pricing"] },
	{ url: "https://www.reddit.com/r/sysadmin/comments/1a2b3c4/ticketing_system_with_real_sla_reporting/", title: "Ticketing system with real SLA reporting?", themes: ["enterprise"] },
	{ url: "https://www.reddit.com/r/startups/comments/1f5e6g7/shared_inbox_or_real_help_desk/", title: "Shared inbox or a real help desk?", themes: ["startups"] },
	{ url: "https://www.youtube.com/watch?v=Hc8pX3mWq4s", title: "Quaildesk vs Queueloft: honest comparison", themes: ["comparison"] },
	{ url: "https://www.linkedin.com/pulse/support-metrics-that-matter-b2b-saas/", title: "Support metrics that matter in B2B SaaS", themes: ["general", "integrations"] },
	{ url: "https://hbr.org/2025/11/what-customers-want-from-ai-service", title: "What Customers Want from AI Service", themes: ["automation"] },
];

export const CLOSINGS: Record<Theme, string[]> = {
	general: [
		"Shortlist two or three tools and trial them with real tickets for two weeks; how quickly agents find account context tells you more than any feature grid.",
		"If you are choosing today, compare how much each AI agent resolves on its own and what it costs at your volume, since that now drives most of the difference in price.",
	],
	startups: [
		"Start with a tool you can configure yourself in a day; you can add workflows and automation as the team grows.",
		"Pick something with a free or low-cost tier now, but check that it handles SLAs and reporting so you don't have to migrate at 20 agents.",
	],
	automation: [
		"Whichever tool you choose, start the AI on a narrow set of topics, review its answers weekly, and widen its scope as accuracy improves.",
		"Measure the AI by resolutions customers accept, not by deflections, and keep a clear path to a person for anything account-specific.",
	],
	pricing: [
		"When you compare quotes, ask whether AI resolutions, extra channels and analytics are included, since those add-ons can double the bill.",
		"Annual billing usually saves 15 to 20 percent, but negotiate renewal caps up front if you expect to add seats.",
	],
	comparison: [
		"Run both tools side by side with the same set of tickets, and involve two or three agents in the decision, since they will live in it every day.",
	],
	enterprise: [
		"For large teams, plan for a security review and a phased rollout, and ask each vendor for references from companies your size.",
	],
	security: [
		"Always confirm the BAA, and exactly which services it covers, in writing before any patient data reaches the help desk.",
	],
	chat: ["Pick a chat tool that routes into the same queue as email, so customers never have to repeat themselves."],
	"self-service": [
		"Track which articles actually deflect tickets and rewrite the top 20 first; that is where most of the gain is.",
	],
	integrations: [
		"Check that the sync is two-way and near real time; a one-way nightly sync leaves agents working from stale account data.",
	],
	migration: [
		"Run both systems in parallel for a week, then switch your support address and chat widget once the import checks out.",
	],
};

interface OpportunityDraft {
	category: "creation" | "existing-content" | "outreach" | "social";
	title: string;
	why: string;
	prompts: string[];
	/** Cited pages, on the brand's or a competitor's domain. */
	pages: string[];
}

/** Shaped like what the Opportunities generator writes, minus the ids and titles the seed resolves. */
export const OPPORTUNITIES: { summary: string[]; risks: string[]; opportunities: OpportunityDraft[] } = {
	summary: [
		"Quaildesk trails on HIPAA, multilingual and SLA questions, where Queueloft and Northqueue appear in most answers.",
		"Live chat and knowledge base answers favor Lumenreply and Supportpine; Quaildesk appears in fewer than half of them.",
		"Answers lean on review sites, editorial roundups and Reddit threads far more than on quaildesk.com.",
		"Quaildesk already leads on startup, pricing and AI agent questions, so the work there is keeping comparison pages current.",
		"The through-line: earn a place in the roundups and threads that already name rivals, and publish clear answers for regulated and global teams.",
	],
	risks: [
		"HIPAA questions will keep favoring vendors that sign a BAA; content alone won't win them until the product does.",
		"Editorial roundups refresh once or twice a year, so new placements take months to show up in answers.",
		"Avoid incentivized reviews and undisclosed Reddit posts; assistants and moderators increasingly discount both.",
	],
	opportunities: [
		{
			category: "creation",
			title: "Publish a HIPAA and data residency page that says plainly what Quaildesk covers",
			why: "Quaildesk is almost never named in answers to the HIPAA question, while Northqueue is named in nearly all of them. Assistants need a clear, citable statement of what Quaildesk supports before they recommend it to regulated buyers.",
			prompts: [
				"HIPAA-compliant help desk software for healthcare companies",
				"Best enterprise customer service platforms",
			],
			pages: ["https://quaildesk.com/security", "https://northqueue.com/hipaa", "https://queueloft.com/enterprise"],
		},
		{
			category: "creation",
			title: "Create a live chat comparison that puts Quaildesk next to Lumenreply",
			why: "Lumenreply is named in most live chat answers, Quaildesk in under half. Comparison pages are what assistants cite most for these questions, and none of the cited ones include Quaildesk yet.",
			prompts: ["Best live chat software for SaaS websites", "Best AI chatbot for B2B customer support"],
			pages: ["https://lumenreply.com/live-chat", "https://lumenreply.com/", "https://caseorchard.com/ai-agent"],
		},
		{
			category: "creation",
			title: "Write a multilingual support guide with real routing examples",
			why: "Answers about global support teams name Northqueue and Queueloft far more often than Quaildesk. A practical guide gives assistants a reason to cite Quaildesk when buyers ask about languages and routing.",
			prompts: [
				"Best help desk for multilingual support teams",
				"Ticketing systems with SLA management and escalation rules",
			],
			pages: ["https://northqueue.com/enterprise", "https://queueloft.com/enterprise"],
		},
		{
			category: "existing-content",
			title: "Refresh the Quaildesk vs Queueloft page with 2026 pricing",
			why: "The page is already cited in comparison and migration answers, but assistants still quote last year's prices from it. Current numbers keep it the source they rely on.",
			prompts: [
				"Quaildesk vs Queueloft for B2B support teams",
				"Alternatives to Queueloft for growing support teams",
				"How hard is it to migrate from Queueloft to another help desk?",
			],
			pages: ["https://quaildesk.com/compare/queueloft", "https://queueloft.com/pricing"],
		},
		{
			category: "existing-content",
			title: "Update the B2B support benchmarks post with this year's AI resolution data",
			why: "It is already cited in AI agent answers on every assistant tracked; fresh figures help it hold that spot as newer reports appear.",
			prompts: [
				"Help desk software with AI agents that resolve tickets",
				"How to reduce first response time with AI in customer support",
			],
			pages: ["https://quaildesk.com/blog/b2b-support-benchmarks-2026", "https://caseorchard.com/ai-agent"],
		},
		{
			category: "outreach",
			title: "Get Quaildesk into the editorial help desk roundups",
			why: "techradar.com, zdnet.com and pcmag.com are cited across most category answers, and their lists name Queueloft and Brookdesk but not Quaildesk.",
			prompts: ["Best help desk software for B2B SaaS companies", "Help desk pricing comparison for 2026"],
			pages: ["https://queueloft.com/", "https://brookdesk.com/"],
		},
		{
			category: "outreach",
			title: "Grow Quaildesk's review count in the g2.com help desk category",
			why: "Review sites are among the most cited sources for pricing and startup questions. A normal review drive among happy customers raises the odds assistants name Quaildesk from them.",
			prompts: ["Best customer support software for startups", "Most affordable help desk software for a team of 10 agents"],
			pages: ["https://quaildesk.com/pricing", "https://brookdesk.com/pricing"],
		},
		{
			category: "social",
			title: "Answer the recurring 'which help desk' threads on Reddit",
			why: "Threads in r/SaaS and r/CustomerSuccess are cited in startup and comparison answers. Helpful replies from the team, disclosed as such, put Quaildesk in the conversations assistants read.",
			prompts: ["Best customer support software for startups", "Best shared inbox tools for small support teams"],
			pages: ["https://ticketwren.com/"],
		},
		{
			category: "social",
			title: "Post short YouTube walkthroughs of AI ticket triage",
			why: "YouTube walkthroughs are cited in automation answers, and none of the cited ones show Quaildesk yet.",
			prompts: ["How to reduce first response time with AI in customer support"],
			pages: ["https://quaildesk.com/features/ai-agent", "https://caseorchard.com/ai-agent"],
		},
	],
};

/** Body for an answer that recommends no vendor. */
export const GENERIC_ADVICE: Partial<Record<Theme, string>> & { general: string } = {
	general: `When comparing help desks, focus on:

- **Channels:** email, chat and in-app messages in one queue.
- **Account context:** plan, owner and renewal date next to each ticket.
- **Automation:** AI triage and suggested replies, and how they are priced.
- **Reporting:** first response time, resolution time and CSAT by customer tier.`,
	automation: `1. **Triage automatically.** Let AI tag, prioritize and route every new ticket so nothing waits in a general queue.
2. **Draft, don't just deflect.** Have the AI draft a reply from your help center and past tickets for an agent to approve.
3. **Answer the top questions outright.** Let an AI agent resolve the five or ten most common requests end to end.
4. **Set alerts on SLAs.** Escalate tickets that are close to breaching instead of reporting on them afterwards.
5. **Review weekly.** Read a sample of AI replies and update the source articles when an answer is wrong.`,
	migration: `A typical migration takes two to six weeks:

1. **Export** tickets, users, organizations and help center articles through the API.
2. **Map fields** and rebuild automations, macros and SLA policies in the new tool.
3. **Import a sample** and check attachments, internal notes and timestamps.
4. **Run in parallel** for a week, then switch the support address and chat widget.`,
};
