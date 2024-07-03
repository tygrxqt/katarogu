import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function ConfirmSuccessPage() {
	return (
		<>
			<main className="flex min-h-screen-no-nav w-full flex-col items-center justify-center gap-4">
				<h1 className="text-3xl font-bold">(o^▽^o)</h1>
				<h2 className="text-center text-lg text-neutral-500 dark:text-neutral-400">
					Your email has been confirmed successfully!
				</h2>
				<div className="flex flex-row gap-2 items-center">
					<Link href="/">
						<Button variant="outline">Go home</Button>
					</Link>
					<Link href="/profile">
						<Button>View your profile</Button>
					</Link>
				</div>
			</main>
		</>
	);
}
