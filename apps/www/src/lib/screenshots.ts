/* Dashboard captures ship as two static WebP widths: `/screenshots/name.webp` (1600px) and `/screenshots/name-800.webp`. */
export function screenshotSet(src: string) {
	const base = src.replace(/\.webp$/, "");
	return { src, srcSet: `${base}-800.webp 800w, ${src} 1600w`, width: 1600, height: 960 };
}
