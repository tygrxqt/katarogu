"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/provider";
import React from "react";
import { Eye, Mail, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Icons } from "../ui/icons";
import { createClient } from "@/lib/supabase/client";

export default function ProtectedPage({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = createClient();
	const { user, signIn, signInWithOAuth, register, resetPassword } = useAuth();

	const [mode, setMode] = React.useState<"signin" | "register" | "reset">(
		"signin"
	);

	const [name, setName] = React.useState("");
	const [username, setUsername] = React.useState("");

	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [showPassword, setShowPassword] = React.useState(false);

	const togglePassword = () => setShowPassword(!showPassword);

	// TODO: Change this to use <form> instead
	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "Enter" && !user) {
				e.preventDefault();
				switch (mode) {
					case "signin": {
						signIn(email, password);
						break;
					}

					case "register": {
						register(name, username, email, password, confirmPassword);
						break;
					}

					case "reset": {
						resetPassword(email);
						changeMode("signin");
						break;
					}
				}
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [
		confirmPassword,
		email,
		signIn,
		mode,
		name,
		password,
		register,
		resetPassword,
		username,
		user,
	]);

	const changeMode = (mode: "signin" | "register" | "reset") => {
		setMode(mode);
		setName("");
		setUsername("");
		setEmail("");
		setPassword("");
		setConfirmPassword("");
		setShowPassword(false);
	};

	return (
		<>
			{user ? (
				<>
					{typeof user.email_confirmed_at !== "undefined" ? (
						<>{children}</>
					) : (
						<>
							{/* If user is not verified */}
							<div className="absolute left-1/2 top-1/2 w-3/4 -translate-x-1/2 -translate-y-1/2 sm:w-3/4">
								<div className="flex flex-col items-center justify-center gap-6 text-center">
									<div className="flex w-full flex-col items-center justify-center gap-2">
										<h1 className="text-center font-display text-3xl font-bold sm:text-4xl">
											Verification required
										</h1>
										<p className="text-sm text-neutral-500 sm:text-base">
											To continue, please check your email for a verification
											link.
										</p>
									</div>
									<Button
										onClick={() => {
											toast.promise(
												supabase.auth.resend({
													email: user.email as string,
													type: "signup",
												}),
												{
													loading: "Sending verification email...",
													success: "Verification email sent!",
													error: "Failed to send verification email.",
												}
											);
										}}
										className="flex flex-row items-center"
									>
										<Mail className="mr-2 h-4 w-4" />
										Resend verification email
									</Button>
								</div>
							</div>
						</>
					)}
				</>
			) : (
				<>
					{/* If not authenticated */}
					<div className="absolute left-1/2 top-1/2 w-3/4 -translate-x-1/2 -translate-y-1/2 sm:w-1/2 md:w-auto">
						<div className="flex flex-col items-center justify-center gap-6 text-center">
							<div className="flex w-full flex-col items-center justify-center gap-2">
								<h1 className="text-center font-display text-3xl font-bold sm:text-4xl">
									{mode === "signin" && "Sign in to Katarogu"}
									{mode === "register" && "Join the club!"}
									{mode === "reset" && "Reset password"}
								</h1>

								<p className="text-sm text-neutral-500 sm:text-base">
									{mode === "signin" &&
										"Please log in with your Katagoru account to continue."}
									{mode === "register" &&
										"Create a Katagoru account and join the club!"}
									{mode === "reset" &&
										"Please enter your email address to reset your password."}
								</p>
							</div>
							<div className="flex w-full flex-col items-center justify-center gap-4">
								{mode === "signin" && (
									<>
										<div className="flex flex-col gap-4 w-full">
											<div className="w-full flex flex-row gap-4 items-center justify-center">
												<Button
													className="w-full"
													variant="outline"
													onClick={async () => await signInWithOAuth("github")}
												>
													<Icons.Github className="w-4 h-4 mr-2" />
													<span className="hidden xs:block">GitHub</span>
												</Button>

												<Button
													className="w-full"
													variant="outline"
													onClick={async () => await signInWithOAuth("google")}
												>
													<Icons.Google className="w-4 h-4 mr-2" />
													<span className="hidden xs:block">Google</span>
												</Button>

												<Button
													className="w-full"
													variant="outline"
													onClick={async () => await signInWithOAuth("discord")}
												>
													<Icons.Discord className="w-4 h-4 mr-2" />
													<span className="hidden xs:block">Discord</span>
												</Button>
											</div>
										</div>
										<div className="w-full py-2 flex items-center">
											<hr className="w-full border-t border-black/10 dark:border-white/10" />
										</div>
									</>
								)}

								{mode === "signin" && (
									<>
										<Input
											id="email"
											type="email"
											placeholder="Email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
										<div className="flex w-full flex-row items-center gap-2">
											<Input
												id="password"
												type={showPassword ? "text" : "password"}
												placeholder="Password"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
											/>
											<Button
												variant="outline"
												size="icon"
												className="p-2"
												onClick={togglePassword}
											>
												{showPassword ? (
													<EyeOff size={22} />
												) : (
													<Eye size={22} />
												)}
											</Button>
										</div>
										<Button
											className="text-md w-full"
											onClick={() => signIn(email, password)}
										>
											Submit
										</Button>
										<small className="px-2 pt-2 text-center text-neutral-500 dark:text-neutral-400">
											By continuing, you agree to our{" "}
											<a className="text-blue-500" href="/tos">
												Terms of Service
											</a>{" "}
											and{" "}
											<a className="text-blue-500" href="/privacy">
												Privacy Policy
											</a>
											.
										</small>
									</>
								)}
								{mode === "register" && (
									<>
										<Input
											id="name"
											type="text"
											placeholder="Full Name"
											value={name}
											onChange={(e) => setName(e.target.value)}
										/>
										<Input
											id="username"
											type="text"
											placeholder="Username"
											value={username}
											onChange={(e) => setUsername(e.target.value)}
										/>
										<Input
											id="email"
											type="email"
											placeholder="Email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
										<div className="flex w-full flex-row items-center gap-2">
											<Input
												id="password"
												type={showPassword ? "text" : "password"}
												placeholder="Password"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
											/>
											<Button
												variant="outline"
												size="icon"
												className="p-2"
												onClick={togglePassword}
											>
												{showPassword ? (
													<EyeOff size={22} />
												) : (
													<Eye size={22} />
												)}
											</Button>
										</div>
										<Input
											id="passwordConfirm"
											type={showPassword ? "text" : "password"}
											placeholder="Password Confirmation"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
										/>
										<Button
											className="text-md w-full"
											onClick={() => {
												register(
													name,
													username,
													email,
													password,
													confirmPassword
												);
												changeMode("signin");
											}}
										>
											Create Account
										</Button>
										<small className="px-2 pt-2 text-center text-neutral-500 dark:text-neutral-400">
											By continuing, you agree to our{" "}
											<a className="text-blue-500" href="/tos">
												Terms of Service
											</a>{" "}
											and{" "}
											<a className="text-blue-500" href="/privacy">
												Privacy Policy
											</a>
											.
										</small>
									</>
								)}
								{mode === "reset" && (
									<>
										<Input
											id="email"
											type="email"
											placeholder="Email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
										<Button
											className="text-md w-full"
											onClick={() => {
												resetPassword(email);
												changeMode("signin");
											}}
										>
											Send
										</Button>
									</>
								)}
							</div>
							<hr className="w-full border border-black/10 dark:border-white/10" />
							<div className="flex w-full flex-col items-center">
								{mode === "signin" && (
									<>
										<span>
											Forgot password?{" "}
											<Button
												variant={"link"}
												className="p-0 text-blue-500 dark:text-blue-500"
												onClick={() => changeMode("reset")}
											>
												Reset
											</Button>
										</span>
										<span>
											Don&apos;t have an account?{" "}
											<Button
												variant={"link"}
												className="p-0 text-blue-500 dark:text-blue-500"
												onClick={() => changeMode("register")}
											>
												Sign up
											</Button>
										</span>
									</>
								)}
								{mode === "reset" && (
									<>
										<span>
											Remember your password?{" "}
											<Button
												variant={"link"}
												className="p-0 text-blue-500 dark:text-blue-500"
												onClick={() => changeMode("signin")}
											>
												Sign in
											</Button>
										</span>
									</>
								)}
								{mode === "register" && (
									<>
										<span>
											Already have an account?{" "}
											<Button
												variant={"link"}
												className="p-0 text-blue-500 dark:text-blue-500"
												onClick={() => changeMode("signin")}
											>
												Sign in
											</Button>
										</span>
									</>
								)}
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}
