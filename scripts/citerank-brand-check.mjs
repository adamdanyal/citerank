// Lists customer-facing text and files that still name Elmo, so a merged Elmo
// release can't bring the name back unnoticed. Run after every merge:
//
//   node scripts/citerank-brand-check.mjs          every hit, by file
//   node scripts/citerank-brand-check.mjs --files  hit counts only
//
// Exits 1 while anything is left. Code comments are ignored, and so are the
// internal names and files listed in ALLOWED, each with the reason it can stay.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const SCANNED = [
	"apps/web/src",
	"apps/web/public",
	"apps/www/src",
	"apps/www/public",
	"packages/api-spec/src",
	"packages/config/src",
	"packages/deployment/src",
	"packages/docs/content",
	"packages/og/src",
	"packages/ui/src",
];

const CODE = /\.(tsx?|mjs|js|css)$/;
const TEXT = /\.(tsx?|mjs|js|css|mdx?|json|html|txt|webmanifest|svg|xml|ya?ml)$/;
const SKIPPED = /(\.test\.|\.stories\.|\/stories\/|\/__tests__\/|\/test\/|routeTree\.gen\.ts$)/;
const NAME = /elmo/i;

// Names a customer never sees. They apply to code only: in docs or page text
// the same words would be on screen.
const ALLOWED_NAMES = [
	/\bELMO_[A-Z0-9_]+/g, // constant and env var names
	/\bisElmo\w*/g, // variable and function names
	/\belmo_(orgs|admin|report_generator_access)\b/g, // whitelabel Auth0 claims
	/\belmo_cloud_/g, // Stripe price lookup keys
	/\belmo[.:][a-z][\w.-]*/g, // browser storage keys and symbols
	/\bx-elmo-/g, // OpenAPI extension keys
];

// Real names that happen to contain the letters, wherever they appear.
const ALLOWED_WORDS = [/model\s?monitor/gi];

const ALLOWED_TEXT = [
	{ file: "apps/web/src/routes/auth/login.tsx", text: /demo@elmohq\.com/g, why: "demo-mode sign-in only" },
	{ file: "packages/config/src/env-registry.ts", text: /`elmo init`|Elmo </g, why: "operator-only env descriptions" },
	{ file: "packages/api-spec/src/openapi.json", text: /"x-elmo-[a-z-]+"/g, why: "machine-read spec extension keys" },
];

const ALLOWED_FILES = {
	"apps/web/src/routes/_authed/app/org/$org/settings/skill.tsx": "the sidebar links it in local mode only",
	"apps/web/src/routes/_authed/app/org/$org/settings/api.tsx": "its Elmo SDK snippets render in local mode only",
};

function isComment(line) {
	const start = line.trimStart();
	return (
		start.startsWith("//") ||
		start.startsWith("*") ||
		start.startsWith("/*") ||
		start.startsWith("{/*") ||
		start.startsWith("<!--")
	);
}

function visibleText(file, line) {
	let text = line;
	if (CODE.test(file)) {
		if (isComment(text)) return "";
		text = text.replace(/\s\/\/\s.*$/, "");
		for (const name of ALLOWED_NAMES) text = text.replace(name, "");
	}
	for (const allowed of ALLOWED_TEXT) {
		if (allowed.file === file) text = text.replace(allowed.text, "");
	}
	for (const word of ALLOWED_WORDS) text = text.replace(word, "");
	return text;
}

const hits = new Map();
function record(file, entry) {
	if (!hits.has(file)) hits.set(file, []);
	hits.get(file).push(entry);
}

for (const dir of SCANNED) {
	for (const entry of readdirSync(join(ROOT, dir), { recursive: true, withFileTypes: true })) {
		if (!entry.isFile()) continue;
		const file = join(entry.parentPath, entry.name).slice(ROOT.length);
		if (SKIPPED.test(file) || file in ALLOWED_FILES) continue;
		if (NAME.test(entry.name)) record(file, "file name");
		if (!TEXT.test(file)) continue;
		readFileSync(join(ROOT, file), "utf8")
			.split("\n")
			.forEach((line, index) => {
				if (NAME.test(visibleText(file, line))) record(file, `${index + 1}: ${line.trim().slice(0, 160)}`);
			});
	}
}

const filesOnly = process.argv.includes("--files");
let total = 0;
for (const [file, entries] of [...hits].sort(([a], [b]) => a.localeCompare(b))) {
	total += entries.length;
	console.log(filesOnly ? `${String(entries.length).padStart(4)}  ${file}` : `\n${file}`);
	if (!filesOnly) for (const entry of entries) console.log(`  ${entry}`);
}

if (total === 0) {
	console.log("No customer-facing Elmo text left.");
} else {
	console.log(`\n${total} Elmo mentions in ${hits.size} files.`);
	process.exitCode = 1;
}
