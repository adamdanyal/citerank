import { createFileRoute, redirect } from "@tanstack/react-router";

/* The preview became the home page; old links to it land there. */
export const Route = createFileRoute("/v3")({
	beforeLoad: () => {
		throw redirect({ to: "/", statusCode: 301 });
	},
});
