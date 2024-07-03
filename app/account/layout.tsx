"use client";

import ProfileHeader from "@/components/profile/header";
import ProtectedPage from "@/components/auth/protected";
import { useAuth } from "@/components/auth/provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function AccountLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user } = useAuth();
	const path = usePathname();

	return (
		<>
			<ProtectedPage>
				{user && (
					<>
						<ProfileHeader>
							<Link href="/profile">
								<Button size="sm">View Profile</Button>
							</Link>
						</ProfileHeader>
						<div className="flex flex-col gap-4 py-0 sm:flex-row sm:py-4">
							<div className="flex w-full flex-col gap-2 p-2 sm:w-1/4">
								<Link href="/account" className="w-full">
									<Button
										variant="ghost"
										className={cn(
											"w-full justify-start",
											`${
												path === "/account"
													? "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
													: ""
											}`
										)}
									>
										General
									</Button>
								</Link>
								<Link href="/account/privacy" className="w-full">
									<Button
										variant="ghost"
										className={cn(
											"w-full justify-start",
											`${
												path === "/account/privacy"
													? "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
													: ""
											}`
										)}
									>
										Privacy
									</Button>
								</Link>
								<Link href="/account/providers" className="w-full">
									<Button
										variant="ghost"
										className={cn(
											"w-full justify-start flex flex-row gap-2",
											`${
												path === "/account/providers"
													? "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
													: ""
											}`
										)}
									>
										<span>OAuth</span>
									</Button>
								</Link>
								<Link href="/account/danger" className="w-full">
									<Button
										variant="ghost"
										className={cn(
											"w-full justify-start hover:bg-red-500 hover:text-neutral-100 dark:hover:bg-red-700",
											`${
												path === "/account/danger"
													? "bg-red-500 text-neutral-100 dark:bg-red-700 dark:text-neutral-50"
													: ""
											}`
										)}
									>
										Danger Zone
									</Button>
								</Link>
							</div>
							<div className="w-full sm:w-3/4">{children}</div>
						</div>
					</>
				)}
			</ProtectedPage>
		</>
	);
}
