import { Link, useLocation } from "@tanstack/react-router";
import { cloudAppUrl, cloudSignupUrl } from "@workspace/config/referrals";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { EASE_CLASS, PRIMARY_BUTTON, SMALL_BUTTON, SMALL_BUTTON_BASE } from "./ui";

const SIGN_IN_URL = cloudAppUrl("marketing-nav");
const SIGN_UP_URL = cloudSignupUrl("marketing-nav");

const LINKS = [
	{ href: "/features", label: "Features" },
	{ href: "/pricing", label: "Pricing" },
	{ href: "/agency", label: "Agency" },
];

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

function MenuIcon({ open }: { open: boolean }) {
	const line = `absolute left-0 top-1/2 -mt-px h-0.5 w-4 rounded-full bg-current transition-transform duration-300 ${EASE_CLASS}`;
	return (
		<span aria-hidden="true" className="relative block size-4">
			<span className={`${line} ${open ? "rotate-45" : "-translate-y-1"}`} />
			<span className={`${line} ${open ? "-rotate-45" : "translate-y-1"}`} />
		</span>
	);
}

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

	const current = (href: string) => (pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined);

	return (
		<>
			<header className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4">
				<nav
					aria-label="Main"
					className="pointer-events-auto flex h-12 w-full max-w-6xl items-center justify-between gap-6 rounded-xl bg-paper/80 pl-4 pr-2 shadow-[0_1px_2px_rgb(26_25_23/0.05),0_12px_32px_-16px_rgb(26_25_23/0.25)] ring-1 ring-zinc-950/5 backdrop-blur-md md:pl-6"
				>
					<Link to="/" className={`flex items-center rounded-md ${FOCUS}`}>
						<Logo className="text-xl" />
					</Link>
					<ul className="hidden items-center gap-1 md:flex md:flex-1 md:pl-6">
						{LINKS.map((link) => (
							<li key={link.href}>
								<a
									href={link.href}
									aria-current={current(link.href)}
									className={`inline-flex h-8 items-center rounded-md px-3 title-4 text-zinc-600 transition-colors duration-300 ${EASE_CLASS} hover:bg-paper-2 hover:text-zinc-950 aria-[current=page]:bg-paper-2 aria-[current=page]:text-zinc-950 ${FOCUS}`}
								>
									{link.label}
								</a>
							</li>
						))}
					</ul>
					<div className="flex items-center gap-1">
						<a
							href={SIGN_IN_URL}
							className={`hidden sm:inline-flex ${SMALL_BUTTON_BASE} text-zinc-700 hover:bg-paper-2 hover:text-zinc-950`}
						>
							Sign in
						</a>
						<a href={SIGN_UP_URL} className={`${SMALL_BUTTON} bg-blue-600 text-white hover:bg-blue-700`}>
							Sign up
							<ArrowRight className="size-3.5 max-[360px]:hidden" aria-hidden="true" />
						</a>
						<button
							type="button"
							onClick={() => setOpen((value) => !value)}
							aria-expanded={open}
							aria-controls="site-menu"
							aria-label={open ? "Close menu" : "Open menu"}
							className={`${SMALL_BUTTON} size-8 px-0 text-zinc-950 hover:bg-paper-2 md:hidden`}
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
				className={`fixed inset-0 z-50 flex flex-col bg-paper/95 backdrop-blur-xl transition-opacity duration-300 ${EASE_CLASS} md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
			>
				<div className="mx-4 mt-4 flex h-12 items-center justify-between pl-4 pr-2">
					<Link to="/" className={`flex items-center rounded-md ${FOCUS}`}>
						<Logo className="text-xl" />
					</Link>
					<button
						type="button"
						onClick={() => setOpen(false)}
						aria-label="Close menu"
						className={`${SMALL_BUTTON} size-8 px-0 text-zinc-950 hover:bg-paper-2`}
					>
						<MenuIcon open />
					</button>
				</div>
				<ul className="flex flex-1 flex-col justify-center gap-2 px-6">
					{[...LINKS, { href: SIGN_IN_URL, label: "Sign in" }].map((link, index) => (
						<li key={link.href} className="cr-menu-link" style={{ transitionDelay: open ? `${index * 60}ms` : "0ms" }}>
							<a
								href={link.href}
								aria-current={current(link.href)}
								className={`heading-4 block rounded-lg px-2 py-2 text-zinc-950 transition-colors duration-300 ${EASE_CLASS} hover:text-blue-700 aria-[current=page]:text-blue-700 ${FOCUS}`}
							>
								{link.label}
							</a>
						</li>
					))}
				</ul>
				<div className="px-6 pb-8">
					<a href={SIGN_UP_URL} className={`${PRIMARY_BUTTON} w-full`}>
						Sign up
						<ArrowRight className="size-4" aria-hidden="true" />
					</a>
				</div>
			</div>
		</>
	);
}
