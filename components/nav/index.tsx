"use client";

import Link from "next/link";
import React from "react";
import { ThemeToggle } from "@/components/theme/toggle";
import AuthPopup from "@/components/auth/auth-popup";
import UserInfo from "@/components/auth/user-info";
import { useAuth } from "../auth/provider";

export default function Nav() {
	const { user } = useAuth();

	return (
		<>
			<nav className="flex w-full flex-col items-center">
				<div className="flex w-full flex-row items-center justify-between gap-2 py-4">
					<div className="flex flex-row items-center gap-2">
						<Link
							href="/"
							passHref
							className="flex flex-row items-center gap-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="36"
								height="36"
								viewBox="0 0 500 500"
								fill="none"
							>
								<path
									d="M61 145H400.774C425.164 313.333 379.99 392.12 379.99 392.12C379.99 392.12 352.103 450.814 251.671 429.233"
									stroke="currentColor"
									fill="none"
									strokeWidth="72"
								/>
								<path
									d="M218.008 20C229.479 120.843 214.136 347.822 61 449"
									stroke="currentColor"
									fill="none"
									strokeWidth="72"
								/>
							</svg>
							<span className="relative -top-1/2 text-xl font-bold">
								Katarogu
							</span>
						</Link>
						<div className="hidden flex-row items-center gap-2 pl-8 sm:flex"></div>
					</div>
					<div className="flex flex-row items-center gap-3">
						<ThemeToggle />
						{user ? <UserInfo /> : <AuthPopup />}
					</div>
				</div>
			</nav>
		</>
	);
}
