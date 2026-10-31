import geistMono400 from "virtual:font/geist-mono-400";
import geistSans400 from "virtual:font/geist-sans-400";
import geistSans500 from "virtual:font/geist-sans-500";
import inter400 from "virtual:font/inter-400";
import inter500 from "virtual:font/inter-500";
import jetbrainsMono400 from "virtual:font/jetbrains-mono-400";
import schibstedGrotesk600 from "virtual:font/schibsted-grotesk-600";
import titanOne400 from "virtual:font/titan-one-400";
import type { FontLoader } from "@takumi-rs/core";

/** The faces the card renderers use, embedded into the server bundle at build time. */
export const OG_FONTS: FontLoader[] = [
	{ name: "Titan One", data: titanOne400, style: "normal", weight: 400 },
	{ name: "Geist Sans", data: geistSans400, style: "normal", weight: 400 },
	{ name: "Geist Sans", data: geistSans500, style: "normal", weight: 500 },
	{ name: "Geist Mono", data: geistMono400, style: "normal", weight: 400 },
	{ name: "Schibsted Grotesk", data: schibstedGrotesk600, style: "normal", weight: 600 },
	{ name: "Inter", data: inter400, style: "normal", weight: 400 },
	{ name: "Inter", data: inter500, style: "normal", weight: 500 },
	{ name: "JetBrains Mono", data: jetbrainsMono400, style: "normal", weight: 400 },
];
