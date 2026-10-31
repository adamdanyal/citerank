import { Link } from "@tanstack/react-router";
import { cloudAppUrl, cloudSignupUrl } from "@workspace/config/referrals";
import { Button } from "@workspace/ui/components/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@workspace/ui/components/navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { ArrowRight } from "lucide-react";
import { Logo } from "./logo";

const SIGN_IN_URL = cloudAppUrl("marketing-nav");
const SIGN_UP_URL = cloudSignupUrl("marketing-nav");

const navigationLinks = [
	{ href: "/features", label: "Features" },
	{ href: "/pricing", label: "Pricing" },
];

export function Navbar() {
	return (
		<header className="sticky top-0 z-40 border-b border-zinc-200 bg-paper/90 backdrop-blur">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
				<div className="flex items-center gap-3 md:gap-8">
					<NavigationMenu className="md:hidden" orientation="vertical">
						<Popover>
							<PopoverTrigger
								render={<Button className="group size-8" variant="ghost" size="icon" aria-label="Open menu" />}
							>
								<svg
									aria-hidden="true"
									className="pointer-events-none"
									width={16}
									height={16}
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M4 12L20 12"
										className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
									/>
									<path
										d="M4 12H20"
										className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
									/>
									<path
										d="M4 12H20"
										className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
									/>
								</svg>
							</PopoverTrigger>
							<PopoverContent align="start" className="w-44 p-1">
								<NavigationMenuList className="w-full flex-col items-start gap-0">
									{navigationLinks.map((link) => (
										<NavigationMenuItem key={link.href} className="w-full">
											<NavigationMenuLink href={link.href} className="py-1.5">
												{link.label}
											</NavigationMenuLink>
										</NavigationMenuItem>
									))}
								</NavigationMenuList>
							</PopoverContent>
						</Popover>
					</NavigationMenu>
					<Link to="/" className="flex items-center">
						<Logo className="text-2xl max-[375px]:text-xl" />
					</Link>
					<NavigationMenu className="mx-auto max-md:hidden">
						<NavigationMenuList className="gap-1">
							{navigationLinks.map((link) => (
								<NavigationMenuItem key={link.href}>
									<NavigationMenuLink href={link.href} className="py-1.5 font-medium text-zinc-600 hover:text-zinc-950">
										{link.label}
									</NavigationMenuLink>
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="flex items-center gap-2">
					<a
						href={SIGN_IN_URL}
						className="hidden h-8 items-center rounded-md px-3 text-sm font-medium leading-none text-zinc-700 hover:text-zinc-950 sm:inline-flex"
					>
						Sign in
					</a>
					<a
						href={SIGN_UP_URL}
						className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md bg-blue-600 px-3 text-sm font-medium leading-none text-white ring-1 ring-blue-600 hover:bg-blue-700"
					>
						Sign up
						<ArrowRight className="size-3.5 max-[360px]:hidden" />
					</a>
				</div>
			</div>
		</header>
	);
}
