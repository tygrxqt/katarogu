"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/provider";
import React, { FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Icons } from "../ui/icons";
import Spinner from "../spinner";

export default function ProtectedPage({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, signIn, signInWithOAuth, register, resetPassword } = useAuth();

	const [mode, setMode] = React.useState<"signin" | "register" | "reset">(
		"signin"
	);
	const [loading, setLoading] = React.useState(false);

	const [name, setName] = React.useState("");
	const [username, setUsername] = React.useState("");

	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [showPassword, setShowPassword] = React.useState(false);

	const togglePassword = () => setShowPassword(!showPassword);

	const changeMode = (mode: "signin" | "register" | "reset") => {
		if (loading === true) return;
		setMode(mode);
		setName("");
		setUsername("");
		setEmail("");
		setPassword("");
		setConfirmPassword("");
		setShowPassword(false);
	};

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);

		switch (mode) {
			case "signin": {
				await signIn(email, password).then((res) => {
					if (res === true) {
						// Reset values
						changeMode("signin");
					}
				});

				setLoading(false);
				break;
			}
			case "register": {
				await register(name, email, username, password, confirmPassword).then(
					(res) => {
						if (res === true) {
							// Reset values
							changeMode("register");
						}
					}
				);

				setLoading(false);
				break;
			}
			case "reset": {
				await resetPassword(email);

				setLoading(false);
				break;
			}
		}
	};

	return (
		<>
			{user ? (
				<>{children}</>
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
													disabled={loading}
												>
													<Icons.Github className="w-4 h-4 xs:mr-2" />
													<span className="hidden xs:block">GitHub</span>
												</Button>

												<Button
													className="w-full"
													variant="outline"
													onClick={async () => await signInWithOAuth("google")}
													disabled={loading}
												>
													<Icons.Google className="w-4 h-4 xs:mr-2" />
													<span className="hidden xs:block">Google</span>
												</Button>

												<Button
													className="w-full"
													variant="outline"
													onClick={async () => await signInWithOAuth("discord")}
													disabled={loading}
												>
													<Icons.Discord className="w-4 h-4 xs:mr-2" />
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
										<form
											className="flex flex-col gap-4 w-full"
											onSubmit={(e) => onSubmit(e)}
										>
											<Input
												id="email"
												type="email"
												placeholder="Email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												disabled={loading}
											/>
											<div className="flex w-full flex-row items-center gap-2">
												<Input
													id="password"
													type={showPassword ? "text" : "password"}
													placeholder="Password"
													value={password}
													onChange={(e) => setPassword(e.target.value)}
													disabled={loading}
												/>
												<Button
													variant="outline"
													size="icon"
													className="p-2"
													onClick={togglePassword}
													type="button"
													disabled={loading}
												>
													{showPassword ? (
														<EyeOff size={22} />
													) : (
														<Eye size={22} />
													)}
												</Button>
											</div>
											<Button className="text-md w-full" disabled={loading}>
												{loading ? <Spinner size={24} /> : "Submit"}
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
										</form>
									</>
								)}
								{mode === "register" && (
									<>
										<form
											className="flex flex-col gap-4 w-full"
											onSubmit={(e) => onSubmit(e)}
										>
											<Input
												id="name"
												type="text"
												placeholder="Full Name"
												value={name}
												onChange={(e) => setName(e.target.value)}
												disabled={loading}
											/>
											<Input
												id="username"
												type="text"
												placeholder="Username"
												value={username}
												onChange={(e) => setUsername(e.target.value)}
												disabled={loading}
											/>
											<Input
												id="email"
												type="email"
												placeholder="Email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												disabled={loading}
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
													disabled={loading}
													type="button"
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
												disabled={loading}
											/>
											<Button className="text-md w-full" disabled={loading}>
												Create Account
											</Button>
										</form>

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
										<form
											className="flex flex-col gap-4 w-full"
											onSubmit={(e) => onSubmit(e)}
										>
											<Input
												id="email"
												type="email"
												placeholder="Email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												disabled={loading}
											/>
											<Button className="text-md w-full" disabled={loading}>
												Send
											</Button>
										</form>
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
