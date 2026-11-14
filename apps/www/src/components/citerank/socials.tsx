import { SOCIALS } from "@/lib/socials";
import { EASE_CLASS } from "./ui";

export function LinkedInMark({ className = "size-3.5" }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className={`shrink-0 fill-current ${className}`}>
			<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
		</svg>
	);
}

/** The eight social profiles as icon links; the name is read out, not shown. */
export function SocialIcons({
	className = "",
	linkClassName = "text-zinc-400 hover:text-zinc-950",
	iconClassName = "size-4",
}: {
	className?: string;
	linkClassName?: string;
	iconClassName?: string;
}) {
	return (
		<ul className={`flex flex-wrap items-center gap-4 ${className}`}>
			{SOCIALS.map((social) => (
				<li key={social.href}>
					<a
						href={social.href}
						target="_blank"
						rel="noopener noreferrer"
						className={`inline-flex rounded-sm transition-colors duration-300 ${EASE_CLASS} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 ${linkClassName}`}
					>
						<span className="sr-only">{social.name}</span>
						<svg viewBox="0 0 24 24" aria-hidden="true" className={`${iconClassName} fill-current`}>
							<path d={social.path} />
						</svg>
					</a>
				</li>
			))}
		</ul>
	);
}
