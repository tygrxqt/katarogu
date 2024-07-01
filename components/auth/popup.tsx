"use client";

import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import React, { useState } from "react";
import { useAuth } from "./provider";
import Spinner from "../spinner";
import { Eye, EyeOff } from "lucide-react";
import { Icons } from "../ui/icons";
import pb from "@/lib/pocketbase";

export default function AuthPopup() {
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState("signin");
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [passwordConfirm, setPasswordConfirm] = React.useState("");
	const [showPassword, setShowPassword] = React.useState(false);

	const togglePassword = () => setShowPassword(!showPassword);

	const [loading, setLoading] = React.useState(false);

	const { logIn, register } = useAuth();

	const reset = () => {
		setName("");
		setEmail("");
		setUsername("");
		setPassword("");
		setPasswordConfirm("");

		setLoading(false);
	};

	const onSignIn = async () => {
		setLoading(true);

		await logIn(email, password).then((res) => {
			if (res === true) {
				setOpen(false);
				reset();
			} else {
				setLoading(false);
			}
		});
	};

	const onOAuthSignIn = async (provider: "github" | "google" | "discord") => {
		//
	};

	const onRegister = async () => {
		setLoading(true);

		await register(name, email, username, password, passwordConfirm).then(
			(res) => {
				if (res === true) {
					setOpen(false);
					reset();
				} else {
					setLoading(false);
				}
			}
		);
	};

	const onReset = async () => {
		//
	};

	const changeMode = (mode: string) => {
		setMode(mode);
		reset();
	};

	if (isDesktop) {
		return (
			<>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button>Sign In</Button>
					</DialogTrigger>
					<DialogContent className="p-0 sm:max-w-[425px]">
						<DialogHeader className="px-6 pt-6">
							<DialogTitle>
								{mode === "signin" && "Sign in"}
								{mode === "register" && "Register"}
								{mode === "reset" && "Reset Password"}
							</DialogTitle>
							<DialogDescription>
								{mode === "signin" && "Sign in with your credentials here."}
								{mode === "register" && "Create an account to get started."}
								{mode === "reset" &&
									"Please provide the email associated with your account to request a password reset."}
							</DialogDescription>
						</DialogHeader>
						<div className="flex flex-col gap-2 py-2">
							<div className="flex w-full flex-col gap-3 px-4">
								{mode === "signin" && (
									<>
										<div className="flex flex-col gap-4">
											<div className="w-full flex flex-row gap-4 items-center justify-center">
												<Button
													className="w-full"
													variant="outline"
													onClick={async () => await onOAuthSignIn("github")}
												>
													<Icons.Github className="w-4 h-4 mr-2" />
													GitHub
												</Button>

												<Button
													className="w-full"
													variant="outline"
													onClick={async () => await onOAuthSignIn("google")}
												>
													<Icons.Google className="w-4 h-4 mr-2" />
													Google
												</Button>

												<Button
													className="w-full"
													variant="outline"
													onClick={async () => await onOAuthSignIn("discord")}
												>
													<Icons.Discord className="w-4 h-4 mr-2" />
													Discord
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
											action={onSignIn}
											className="flex w-full flex-col items-center gap-4"
										>
											<Input
												placeholder="Email"
												type="email"
												value={email}
												autoComplete="email"
												onChange={(e) => setEmail(e.target.value)}
												disabled={loading}
											/>
											<div className="flex w-full flex-row items-center gap-2">
												<Input
													id="password"
													type={showPassword ? "text" : "password"}
													placeholder="Password"
													value={password}
													autoComplete="current-password"
													onChange={(e) => setPassword(e.target.value)}
													disabled={loading}
												/>
												<Button
													variant="outline"
													size="icon"
													type="button"
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
												type="submit"
												className="w-full data-[loading=true]:cursor-not-allowed"
												disabled={loading}
												data-loading={loading}
											>
												{loading ? <Spinner size={16} /> : "Submit"}
											</Button>
										</form>
									</>
								)}
								{mode === "register" && (
									<>
										<form
											action={onRegister}
											className="flex w-full flex-col items-center gap-4"
										>
											<Input
												id="register-name"
												placeholder="Name"
												type="text"
												value={name}
												autoComplete="name"
												onChange={(e) => setName(e.target.value)}
											/>
											<Input
												id="register-email"
												placeholder="Email"
												type="email"
												value={email}
												autoComplete="email"
												onChange={(e) => setEmail(e.target.value)}
											/>
											<Input
												id="register-username"
												placeholder="Username"
												type="text"
												value={username}
												autoComplete="username"
												onChange={(e) => setUsername(e.target.value)}
											/>
											<div className="flex w-full flex-row items-center gap-2">
												<Input
													id="register-password"
													type={showPassword ? "text" : "password"}
													placeholder="Password"
													value={password}
													autoComplete="new-password"
													onChange={(e) => setPassword(e.target.value)}
												/>
												<Button
													variant="outline"
													size="icon"
													type="button"
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
												id="register-confirm-password"
												placeholder="Confirm Password"
												type={showPassword ? "text" : "password"}
												value={passwordConfirm}
												autoComplete="new-password"
												onChange={(e) => setPasswordConfirm(e.target.value)}
											/>
											<Button
												type="submit"
												className="w-full data-[loading=true]:cursor-not-allowed"
												disabled={loading}
												data-loading={loading}
											>
												{loading ? <Spinner size={16} /> : "Submit"}
											</Button>
										</form>
									</>
								)}
								{mode === "reset" && (
									<>
										<form
											action={onReset}
											className="flex w-full flex-col items-center gap-4"
										>
											<Input
												id="reset-password-email"
												placeholder="Email"
												value={email}
												autoComplete="email"
												onChange={(e) => setEmail(e.target.value)}
											/>
											<Button
												type="submit"
												className="w-full data-[loading=true]:cursor-not-allowed"
												disabled={loading}
												data-loading={loading}
											>
												{loading ? <Spinner size={16} /> : "Submit"}
											</Button>
										</form>
									</>
								)}
							</div>
							<div className="px-6 pt-3 text-center">
								<span className="text-sm">
									By continuing, you agree to our{" "}
									<a href="#" className="text-blue-500 hover:underline">
										Terms of Service
									</a>{" "}
									and{" "}
									<a href="#" className="text-blue-500 hover:underline">
										Privacy Policy
									</a>
									.
								</span>
							</div>
						</div>
						<div className="mx-auto flex w-full flex-col items-center gap-2 border-t border-black/10 p-4 dark:border-white/10">
							<div className="flex flex-col items-center gap-2">
								{mode === "signin" && (
									<>
										<div className="flex flex-row gap-2">
											<span>Forgot password?</span>
											<button
												className="text-blue-500 hover:underline"
												onClick={() => changeMode("reset")}
											>
												Reset
											</button>
										</div>
										<div className="flex flex-row gap-2">
											<span>Don&apos;t have an account?</span>
											<button
												className="text-blue-500 hover:underline"
												onClick={() => changeMode("register")}
											>
												Register
											</button>
										</div>
									</>
								)}
								{mode === "register" && (
									<>
										<div className="flex flex-row gap-2">
											<span>Already have an account?</span>
											<button
												className="text-blue-500 hover:underline"
												onClick={() => changeMode("signin")}
											>
												Sign in
											</button>
										</div>
									</>
								)}
								{mode === "reset" && (
									<>
										<div className="flex flex-row gap-2">
											<span>Remember your password?</span>
											<button
												className="text-blue-500 hover:underline"
												onClick={() => changeMode("signin")}
											>
												Sign in
											</button>
										</div>
									</>
								)}
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</>
		);
	} else {
		return (
			<>
				<Drawer direction="bottom" open={open} onOpenChange={setOpen}>
					<DrawerTrigger asChild>
						<Button>Sign In</Button>
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle className="font-display text-3xl font-black">
								{mode === "signin" && "Sign In"}
								{mode === "register" && "Register"}
								{mode === "reset" && "Reset Password"}
							</DrawerTitle>
							<DrawerDescription>
								{mode === "signin" && "Sign in with your credentials here."}
								{mode === "register" && "Create an account to get started."}
								{mode === "reset" &&
									"Please provide the email associated with your account to request a password reset."}
							</DrawerDescription>
						</DrawerHeader>
						<div className="flex flex-col gap-2 pt-2">
							<div className="flex w-full flex-col gap-3 px-4">
								{mode === "signin" && (
									<>
										<div className="flex flex-col gap-4">
											<div className="w-full flex flex-row gap-4 items-center justify-center">
												<Button
													className="w-full"
													variant="outline"
													onClick={async () => await onOAuthSignIn("github")}
												>
													<Icons.Github className="w-4 h-4 mr-2" />
													<span className="hidden xs:block">GitHub</span>
												</Button>

												<Button
													className="w-full"
													variant="outline"
													onClick={async () => await onOAuthSignIn("google")}
												>
													<Icons.Google className="w-4 h-4 mr-2" />
													<span className="hidden xs:block">Google</span>
												</Button>

												<Button
													className="w-full"
													variant="outline"
													onClick={async () => await onOAuthSignIn("discord")}
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
										<form
											action={onSignIn}
											className="flex w-full flex-col items-center gap-4"
										>
											<Input
												placeholder="Email / Username"
												type="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
											/>
											<Input
												placeholder="Password"
												type="password"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
											/>
											<Button
												type="submit"
												className="w-full data-[loading=true]:cursor-not-allowed"
												disabled={loading}
												data-loading={loading}
											>
												{loading ? <Spinner size={16} /> : "Submit"}
											</Button>
										</form>
									</>
								)}
								{mode === "register" && (
									<>
										<form
											action={onRegister}
											className="flex w-full flex-col items-center gap-4"
										>
											<Input
												placeholder="Name"
												type="text"
												value={name}
												onChange={(e) => setName(e.target.value)}
											/>
											<Input
												placeholder="Email"
												type="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
											/>
											<Input
												placeholder="Username"
												type="text"
												value={username}
												onChange={(e) => setUsername(e.target.value)}
											/>
											<Input
												placeholder="Password"
												type="password"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
											/>
											<Input
												placeholder="Confirm Password"
												type="password"
												value={passwordConfirm}
												onChange={(e) => setPasswordConfirm(e.target.value)}
											/>
											<Button
												type="submit"
												className="w-full data-[loading=true]:cursor-not-allowed"
												disabled={loading}
												data-loading={loading}
											>
												{loading ? <Spinner size={16} /> : "Submit"}
											</Button>
										</form>
									</>
								)}
								{mode === "reset" && (
									<>
										<form
											action={onReset}
											className="flex w-full flex-col items-center gap-4"
										>
											<Input
												placeholder="Email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
											/>
											<Button
												type="submit"
												className="w-full data-[loading=true]:cursor-not-allowed"
												disabled={loading}
												data-loading={loading}
											>
												{loading ? <Spinner size={16} /> : "Submit"}
											</Button>
										</form>
									</>
								)}
							</div>
							<div className="px-6 py-4 text-center">
								<span>
									By continuing, you agree to our{" "}
									<a href="#" className="text-blue-500 hover:underline">
										Terms of Service
									</a>{" "}
									and{" "}
									<a href="#" className="text-blue-500 hover:underline">
										Privacy Policy
									</a>
									.
								</span>
							</div>
						</div>
						<DrawerFooter>
							<div className="mx-auto flex w-full flex-col items-center gap-2 border-t border-black/10 dark:border-white/10">
								<div className="flex flex-col items-center gap-2 p-4">
									{mode === "signin" && (
										<>
											<div className="flex flex-row gap-2">
												<span>Forgot password?</span>
												<button
													className="text-blue-500 hover:underline"
													onClick={() => changeMode("reset")}
												>
													Reset
												</button>
											</div>
											<div className="flex flex-row gap-2">
												<span>Don&apos;t have an account?</span>
												<button
													className="text-blue-500 hover:underline"
													onClick={() => changeMode("register")}
												>
													Register
												</button>
											</div>
										</>
									)}
									{mode === "register" && (
										<>
											<div className="flex flex-row gap-2">
												<span>Already have an account?</span>
												<button
													className="text-blue-500 hover:underline"
													onClick={() => changeMode("signin")}
												>
													Sign in{" "}
												</button>
											</div>
										</>
									)}
									{mode === "reset" && (
										<>
											<div className="flex flex-row gap-2">
												<span>Remember your password?</span>
												<button
													className="text-blue-500 hover:underline"
													onClick={() => changeMode("signin")}
												>
													Sign in
												</button>
											</div>
										</>
									)}
								</div>
							</div>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			</>
		);
	}
}
