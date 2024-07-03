import { Inter, Sora } from "next/font/google";

import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "sonner";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme/provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import Nav from "@/components/nav";

import "react-image-crop/dist/ReactCrop.css";
import "./globals.css";
import { AuthProvider } from "@/components/auth/provider";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});
const sora = Sora({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-sora",
});

export const metadata: Metadata = {
	title: "Katarogu",
	description: "An Anime and Manga tracker.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<html lang="en" suppressHydrationWarning>
				<head />
				<body
					className={cn(
						"min-h-screen bg-background font-sans antialiased",
						inter.variable,
						sora.variable
					)}
				>
					{process.env.NODE_ENV === "production" && (
						<Script
							async
							src="https://analytics.tygr.dev/script.js"
							data-website-id="b77fbcb1-45fe-44b5-b08d-7f6b5d775451"
						/>
					)}
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<main
							vaul-drawer-wrapper=""
							className="min-h-screen bg-neutral-50 antialiased dark:bg-neutral-950"
						>
							<div className="container">
								<AuthProvider>
									<TooltipProvider>
										<Toaster />
										<Nav />
										{children}
									</TooltipProvider>
								</AuthProvider>
							</div>
						</main>
					</ThemeProvider>
				</body>
			</html>
		</>
	);
}
