import { LINK, SMALL } from "@/components/citerank/v2/kit";
import { resolveAuthor, type TeamAuthor } from "@/data/authors";
import { formatPostDate } from "@/lib/format";

function initials(name: string): string {
	return name
		.split(/\s+/)
		.map((word) => word[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

function InitialsAvatar({ name }: { name: string }) {
	return (
		<span
			aria-hidden
			className="flex size-12 shrink-0 items-center justify-center rounded-full bg-paper-2 text-[0.875rem] font-medium text-zinc-700"
		>
			{initials(name)}
		</span>
	);
}

function TeamAvatar({ author }: { author: TeamAuthor }) {
	if (author.avatar) {
		return <img src={author.avatar} alt="" className="size-12 shrink-0 rounded-full object-cover" />;
	}
	return <InitialsAvatar name={author.name} />;
}

function PostDates({ date, updated }: { date: string; updated?: string }) {
	const publishedLabel = formatPostDate(date);

	if (!updated) return <time dateTime={date}>{publishedLabel}</time>;

	return (
		<>
			<span className="block">
				Updated <time dateTime={updated}>{formatPostDate(updated)}</time>
			</span>
			<span className="block">
				Published <time dateTime={date}>{publishedLabel}</time>
			</span>
		</>
	);
}

/**
 * Byline for a blog post. AI-generated posts (`author: "ai"`) show no author
 * information — just the post dates. Known team authors get a full byline, and
 * anything else falls back to a plain name. See src/data/authors.ts.
 */
export function AuthorByline({ author, date, updated }: { author: string; date: string; updated?: string }) {
	const resolved = resolveAuthor(author);

	if (resolved.kind === "ai") {
		return (
			<div className={`${SMALL} text-zinc-600`}>
				<PostDates date={date} updated={updated} />
			</div>
		);
	}

	const name = resolved.kind === "team" ? resolved.author.name : resolved.name;
	const role = resolved.kind === "team" ? resolved.author.role : undefined;
	const url = resolved.kind === "team" ? resolved.author.url : undefined;

	return (
		<div>
			<div className="flex items-center gap-3">
				{resolved.kind === "team" ? <TeamAvatar author={resolved.author} /> : <InitialsAvatar name={name} />}
				<div className="min-w-0">
					<div className="text-[1rem] leading-[1.4] font-medium text-ink">
						{url ? (
							<a href={url} target="_blank" rel="nofollow noopener noreferrer" className={`${LINK} whitespace-nowrap`}>
								{name}
							</a>
						) : (
							name
						)}
					</div>
					{role ? <div className={`${SMALL} text-zinc-600`}>{role}</div> : null}
				</div>
			</div>
			<div className={`${SMALL} mt-4 text-zinc-600`}>
				<PostDates date={date} updated={updated} />
			</div>
		</div>
	);
}
