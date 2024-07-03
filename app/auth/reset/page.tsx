"use client";

import { useAuth } from "@/components/auth/provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { EyeOff, Eye } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
	const { user, resetPassword } = useAuth();

	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const [email, setEmail] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	const togglePassword = () => setShowPassword(!showPassword);

	const submit = async (e: FormEvent) => {
		e.preventDefault();

		setLoading(true);

		if (password !== passwordConfirm) {
			toast.error("Passwords mismatch!", {
				description: "The passwords do not match. Please try again.",
			});
			setLoading(false);
			return;
		}

		const supabase = createClient();

		const { error } = await supabase.auth.updateUser({
			password,
		});

		setLoading(false);

		if (error) {
			return toast.error("Something went wrong!", {
				description: error.message,
			});
		} else {
			setSuccess(true);
			return toast.success("Success!", {
				description: "Your password has been updated successfully!",
			});
		}
	};

	return (
		<>
			{user ? (
				<>
					{success ? (
						<>
							<main className="flex min-h-screen-no-nav w-full flex-col items-center justify-center gap-6">
								<h1 className="text-3xl font-bold">ヽ(°〇°)ﾉ</h1>
								<h2 className="text-center text-lg text-neutral-500 dark:text-neutral-400">
									Success! Your password has been updated.
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
					) : (
						<>
							<main className="flex min-h-screen-no-nav w-full flex-col items-center justify-center gap-6">
								<h1 className="text-3xl font-bold">(￣▽￣)/</h1>
								<h2 className="text-center text-lg text-neutral-500 dark:text-neutral-400">
									What would you like your new password to be?
								</h2>
								<form
									className="flex flex-col gap-4 items-center w-full max-w-[400px]"
									onSubmit={submit}
								>
									{/* Helper input for 1Password */}
									<input
										className="hidden"
										type="text"
										name="username"
										id="username"
										autoComplete="username"
										value={user?.email}
									/>
									<div className="flex w-full flex-row items-center gap-2">
										<Input
											id="new-password"
											type={showPassword ? "text" : "password"}
											placeholder="New Password"
											value={password}
											autoComplete="new-password"
											onChange={(e) => setPassword(e.target.value)}
											disabled={loading}
										/>
										<Button
											variant="outline"
											size="icon"
											type="button"
											className="p-2"
											onClick={togglePassword}
											tabIndex={-1}
										>
											{showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
										</Button>
									</div>
									<Input
										id="confirm-password"
										type={showPassword ? "text" : "password"}
										placeholder="Confirm Password"
										value={passwordConfirm}
										autoComplete="new-password"
										onChange={(e) => setPasswordConfirm(e.target.value)}
										disabled={loading}
									/>
									<Button className="w-full">Confirm</Button>
								</form>
							</main>
						</>
					)}
				</>
			) : (
				<main className="flex min-h-screen-no-nav w-full flex-col items-center justify-center gap-6">
					<h1 className="text-3xl font-bold">╮(￣ω￣;)╭</h1>
					<h2 className="text-center text-lg text-neutral-500 dark:text-neutral-400">
						Uhhh... Something isn't right. Please try resetting your password
						again.
					</h2>
					<div className="flex flex-col gap-4 items-center w-full max-w-[400px]">
						<Input
							id="email"
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Button
							onClick={async () => await resetPassword(email)}
							className="w-full"
						>
							Submit
						</Button>
					</div>
				</main>
			)}
		</>
	);
}
