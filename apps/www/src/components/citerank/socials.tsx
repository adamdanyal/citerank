import { SOCIALS } from "@/lib/socials";
import { EASE_CLASS } from "./ui";

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
