import { Link, useLocation } from "@tanstack/react-router";
import { cloudAppUrl, cloudSignupUrl } from "@workspace/config/referrals";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { trackEvent } from "@/lib/posthog";
import { ACTION, ACTION_SM, WRAP } from "./v2/kit";

const SIGN_IN_URL = cloudAppUrl("marketing-nav");
const SIGN_UP_URL = cloudSignupUrl("marketing-nav");

const LINKS = [
	{ href: "/features", label: "Features" },
	{ href: "/pricing", label: "Pricing" },
	{ href: "/agency", label: "Agency" },
];

const RESOURCE_GROUPS = [
	{
		heading: "Learn",
		links: [
			{ href: "/answer-engine-optimization", label: "What is AEO?" },
			{ href: "/generative-engine-optimization", label: "What is GEO?" },
			{ href: "/ai-search", label: "AI search guides" },
			{ href: "/aeo-for", label: "AEO by industry" },
			{ href: "/glossary", label: "Glossary" },
			{ href: "/statistics", label: "AI search statistics" },
		],
	},
	{
		heading: "Docs and tools",
		links: [
			{ href: "/blog", label: "Blog" },
			{ href: "/docs", label: "Documentation" },
			{ href: "/docs/api", label: "API reference" },
			{ href: "/ai-visibility-tools", label: "Tool directory" },
			{ href: "/ai-visibility-tools/compare", label: "Compare tools" },
			{ href: "/support", label: "Support" },
		],
	},
];

const RESOURCE_PATHS = RESOURCE_GROUPS.flatMap((group) => group.links.map((link) => link.href));

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";
const NAV_ITEM = `inline-flex h-11 items-center gap-1 rounded-full px-3.5 text-[0.9375rem] font-medium whitespace-nowrap text-zinc-300 transition-colors duration-200 hover:text-paper aria-[current=page]:text-paper ${FOCUS}`;
const MENU_LINK = `block rounded-md px-2 py-2 text-[0.9375rem] font-medium whitespace-nowrap text-zinc-700 transition-colors duration-200 hover:bg-paper-2 hover:text-ink aria-[current=page]:text-blue-700 ${FOCUS}`;
const ICON_BUTTON = `inline-flex size-11 items-center justify-center rounded-full transition-colors duration-200 ${FOCUS}`;

function isUnder(pathname: string, href: string) {
	return pathname === href || pathname.startsWith(`${href}/`);
}

function MenuIcon({ open }: { open: boolean }) {
	const line =
		"absolute left-0 top-1/2 -mt-px h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ease-out";
	return (
		<span aria-hidden="true" className="relative block size-5">
			<span className={`${line} ${open ? "rotate-45" : "-translate-y-1.5"}`} />
			<span className={`${line} ${open ? "-rotate-45" : "translate-y-1.5"}`} />
		</span>
	);
}

/* Opens on hover or click, closes on Escape, on a click outside, or when focus leaves it. */
function ResourcesMenu({ pathname }: { pathname: string }) {
	const [open, setOpen] = useState(false);
	const root = useRef<HTMLLIElement>(null);

	useEffect(() => {
		if (!open) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};
		const onPointer = (event: PointerEvent) => {
			if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		document.addEventListener("pointerdown", onPointer);
		return () => {
			window.removeEventListener("keydown", onKey);
			document.removeEventListener("pointerdown", onPointer);
		};
	}, [open]);

	const current = RESOURCE_PATHS.some((href) => isUnder(pathname, href)) ? "page" : undefined;

	return (
		<li
			ref={root}
			className="relative"
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
			onBlur={(event) => {
				if (!root.current?.contains(event.relatedTarget as Node)) setOpen(false);
			}}
		>
			<button
				type="button"
				aria-expanded={open}
				aria-controls="resources-menu"
				aria-current={current}
				onClick={() => setOpen((value) => !value)}
				className={NAV_ITEM}
			>
				Resources
				<ChevronDown
					className={`size-4 transition-transform duration-200 ease-out ${open ? "rotate-180" : ""}`}
					aria-hidden="true"
				/>
			</button>
			<div
				id="resources-menu"
				inert={!open}
				className={`absolute top-full left-0 z-50 pt-2 transition-[opacity,transform] duration-200 ease-out ${open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}
			>
				<div className="grid w-[32rem] grid-cols-2 gap-6 rounded-card bg-paper p-5 shadow-card ring-1 ring-zinc-200">
					{RESOURCE_GROUPS.map((group) => (
						<div key={group.heading}>
							<p className="px-2 text-[0.875rem] text-zinc-500">{group.heading}</p>
							<ul className="mt-1">
								{group.links.map((link) => (
									<li key={link.href}>
										<a
											href={link.href}
											aria-current={isUnder(pathname, link.href) ? "page" : undefined}
											className={MENU_LINK}
										>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</li>
	);
}

/* An ink bar on every page: the wordmark, the four places a visitor goes, and the one action. */
export function Navbar() {
	const [open, setOpen] = useState(false);
	const pathname = useLocation({ select: (location) => location.pathname });

	useEffect(() => {
		if (!open) return;
		const previous = document.documentElement.style.overflow;
		document.documentElement.style.overflow = "hidden";
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => {
			document.documentElement.style.overflow = previous;
			window.removeEventListener("keydown", onKey);
		};
	}, [open]);

	const current = (href: string) => (isUnder(pathname, href) ? "page" : undefined);

	return (
		<>
			<header className="sticky top-0 z-40 bg-ink text-paper">
				<nav aria-label="Main" className={`${WRAP} flex h-18 items-center gap-6`}>
					<Link to="/" aria-label="CiteRank.com home" className={`flex items-center rounded-md ${FOCUS}`}>
						<Logo className="text-[1.375rem] text-paper" />
					</Link>
					<ul className="hidden items-center md:flex md:flex-1 md:pl-4">
						{LINKS.map((link) => (
							<li key={link.href}>
								<a href={link.href} aria-current={current(link.href)} className={NAV_ITEM}>
									{link.label}
								</a>
							</li>
						))}
						<ResourcesMenu pathname={pathname} />
					</ul>
					<div className="ml-auto flex items-center gap-1 md:ml-0">
						<a href={SIGN_IN_URL} className={`${NAV_ITEM} max-sm:hidden`}>
							Sign in
						</a>
						<a
							href={SIGN_UP_URL}
							onClick={() => trackEvent("signup_click", { from: "nav" })}
							className={`${ACTION_SM} max-[479px]:hidden`}
						>
							Start tracking
						</a>
						<button
							type="button"
							onClick={() => setOpen((value) => !value)}
							aria-expanded={open}
							aria-controls="site-menu"
							aria-label={open ? "Close menu" : "Open menu"}
							className={`${ICON_BUTTON} text-paper hover:bg-ink-well md:hidden`}
						>
							<MenuIcon open={open} />
						</button>
					</div>
				</nav>
			</header>

			<div
				id="site-menu"
				data-menu={open ? "open" : "closed"}
				inert={!open}
				className={`fixed inset-0 z-50 flex flex-col overflow-y-auto bg-paper transition-opacity duration-200 ease-out md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
			>
				<div className={`${WRAP} flex h-18 shrink-0 items-center justify-between`}>
					<Link to="/" aria-label="CiteRank.com home" className={`flex items-center rounded-md ${FOCUS}`}>
						<Logo className="text-[1.375rem]" />
					</Link>
					<button
						type="button"
						onClick={() => setOpen(false)}
						aria-label="Close menu"
						className={`${ICON_BUTTON} text-ink hover:bg-paper-2`}
					>
						<MenuIcon open />
					</button>
				</div>
				<div className={`${WRAP} flex flex-1 flex-col gap-8 py-6`}>
					<ul className="flex flex-col border-b border-zinc-200">
						{[...LINKS, { href: SIGN_IN_URL, label: "Sign in" }].map((link, index) => (
							<li
								key={link.href}
								className="cr-menu-link border-t border-zinc-200"
								style={{ transitionDelay: open ? `${index * 40}ms` : "0ms" }}
							>
								<a
									href={link.href}
									aria-current={current(link.href)}
									className={`font-heading block py-4 text-[1.5rem] leading-[1.2] font-bold tracking-[-0.02em] text-ink aria-[current=page]:text-blue-700 ${FOCUS}`}
								>
									{link.label}
								</a>
							</li>
						))}
					</ul>
					<div
						className="cr-menu-link grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-6"
						style={{ transitionDelay: open ? `${(LINKS.length + 1) * 40}ms` : "0ms" }}
					>
						{RESOURCE_GROUPS.map((group) => (
							<div key={group.heading}>
								<p className="px-2 text-[0.875rem] text-zinc-500">{group.heading}</p>
								<ul className="mt-1 flex flex-col">
									{group.links.map((link) => (
										<li key={link.href}>
											<a href={link.href} aria-current={current(link.href)} className={MENU_LINK}>
												{link.label}
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
				<div className={`${WRAP} shrink-0 pb-8`}>
					<a
						href={SIGN_UP_URL}
						onClick={() => trackEvent("signup_click", { from: "nav-menu" })}
						className={`${ACTION} w-full`}
					>
						Start tracking
					</a>
				</div>
			</div>
		</>
	);
}
