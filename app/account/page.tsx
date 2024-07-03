"use client";

import AccountField from "@/components/account/field";
import { useAuth } from "@/components/auth/provider";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";

import AvatarRemove from "@/components/account/avatar-remove";
import AvatarUpload from "@/components/account/avatar-upload";
import BannerUpload from "@/components/account/banner-upload";
import BannerRemove from "@/components/account/banner-remove";

import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
	const supabase = createClient();
	const { user, avatar, banner } = useAuth();

	const [name, setName] = useState(user?.user_metadata.name);
	const [username, setUsername] = useState(user?.user_metadata.username);

	const handleSave = (
		data: {
			email?: string;
			phone?: string;
			password?: string;
			data?: { username?: string; name?: string };
		},
		message?: string
	) => {
		toast.promise(supabase.auth.updateUser(data), {
			loading: "Saving...",
			success: (data) => {
				return message ?? "Your changes have been saved.";
			},
			error: "Sorry, we failed to save your changes",
		});
	};

	return (
		<>
			{user && (
				<>
					<div className="flex flex-col gap-4 pb-4 sm:gap-8">
						<div className="flex w-full flex-col rounded-md border">
							<div className="flex flex-row justify-between gap-4 border-b p-4 sm:flex-col sm:p-6">
								<div>
									<h1 className="text-xl font-bold">Avatar</h1>
									<p className="text-sm">
										Your avatar can be viewed publicly. Please be sensible with
										your choice.
									</p>
								</div>
								<div className="flex flex-row items-center gap-6 pr-4">
									<Avatar className="h-16 w-16 sm:h-20 sm:w-20 md:h-28 md:w-28">
										<AvatarImage
											src={avatar}
											alt={user.user_metadata.username}
										/>
										<AvatarFallback>
											{(user.user_metadata.username ?? "A")
												.slice(0, 1)
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="my-2 flex flex-col gap-2">
										<AvatarUpload size="sm">Upload</AvatarUpload>
										<AvatarRemove size="sm" variant="outline">
											Remove
										</AvatarRemove>
									</div>
								</div>
							</div>
							<div className="flex flex-row items-center justify-between gap-4 p-4">
								<span className="text-sm text-neutral-600 dark:text-neutral-400">
									Please use an image that is at least 256x256 pixels.
								</span>
							</div>
						</div>
						<div className="flex w-full flex-col rounded-md border">
							<div className="flex flex-col justify-between gap-4 border-b p-4 sm:flex-col sm:p-6">
								<div>
									<h1 className="text-xl font-bold">Banner</h1>
									<p className="text-sm">
										Your banner can be viewed publicly. Please be sensible with
										your choice.
									</p>
								</div>
								<div className="flex flex-col items-center gap-4 sm:flex-row">
									<AspectRatio ratio={4 / 1}>
										<Image
											src={banner}
											priority
											width={1400}
											height={250}
											alt="banner"
											className="h-full w-full rounded-md border border-black/10 object-cover dark:border-white/10"
										/>
									</AspectRatio>
									<div className="flex flex-row gap-2 sm:flex-col">
										<BannerUpload size="sm">Upload</BannerUpload>
										<BannerRemove size="sm" variant="outline">
											Remove
										</BannerRemove>
									</div>
								</div>
							</div>
							<div className="flex flex-row items-center justify-between gap-4 p-4">
								<span className="text-sm text-neutral-600 dark:text-neutral-400">
									Please use an image that is at least 350x150 pixels.
								</span>
							</div>
						</div>
						<AccountField
							title="Username"
							description="This is your unique username that will be used to identify you publicly."
							footer="Please use between 3 and 32 characters."
							action={
								<Button
									size="sm"
									onClick={async () => {
										if (username === user.user_metadata.username)
											return toast.error("No changes were made.", {
												description: "Please make some changes before saving.",
											});

										if (username.length < 3 || username.length > 16)
											return toast.error("Invalid username.", {
												description:
													"Your username must be between 3 and 16 characters long.",
											});

										const formData = new FormData();
										formData.append("username", username);
										handleSave(
											{ data: { username: username } },
											"Your username has been updated."
										);
									}}
								>
									Save
								</Button>
							}
						>
							<Input
								placeholder={user.user_metadata.username}
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className=""
							/>
						</AccountField>
						<AccountField
							title="Display Name"
							description="Please enter your full name, or a display name you are comfortable with."
							footer="Please use 32 characters at maximum."
							action={
								<Button
									size="sm"
									onClick={async () => {
										if (name === user.user_metadata.name)
											return toast.error("No changes were made.", {
												description: "Please make some changes before saving.",
											});

										if (name.length < 1 || name.length > 32)
											return toast.error("Invalid name.", {
												description:
													"Your name must be at least 32 characters long.",
											});

										handleSave(
											{ data: { name: name } },
											"Your name has been updated."
										);
									}}
								>
									Save
								</Button>
							}
						>
							<Input
								placeholder={user.user_metadata.name}
								value={name}
								onChange={(e) => setName(e.target.value)}
								className=""
							/>
						</AccountField>
					</div>
				</>
			)}
		</>
	);
}
