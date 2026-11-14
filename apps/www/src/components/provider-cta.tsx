import { ACTION_QUIET } from "@/components/citerank/v2/kit";

// Affiliate sign-up button for a scraping provider, used from blog MDX. It
// renders its own anchor rather than a markdown link so the styling survives
// Tailwind's source scanning, which covers src/ but not the MDX content dir.
export function ProviderCTA({ href, name, children }: { href: string; name: string; children?: React.ReactNode }) {
	return (
		<div className="not-prose my-6">
			<a href={href} target="_blank" rel="nofollow noopener noreferrer" className={ACTION_QUIET}>
				{children ?? `Get started with ${name}`}
			</a>
		</div>
	);
}
