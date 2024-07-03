"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQueryState } from "nuqs";
import React from "react";

export default function ConfirmErrorPage() {
	const [error] = useQueryState("msg");

	return (
		<>
			<main className="flex min-h-screen-no-nav w-full flex-col items-center justify-center gap-4">
				<h1 className="text-3xl font-black">(╥﹏╥)</h1>
				<h2 className="text-center text-lg text-neutral-500 dark:text-neutral-400">
					Oops! Something went wrong while confirming your email.
				</h2>
				<code className="overflow-scroll max-w-2xl rounded-lg bg-neutral-200 p-2 text-sm dark:bg-neutral-800">
					{error}
				</code>
				<Link href="/">
					<Button>Go home</Button>
				</Link>
			</main>
		</>
	);
}
