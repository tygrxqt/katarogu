"use client";

import AccountField from "@/components/account/field";
import { useAuth } from "@/components/auth/provider";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export default function AccountPrivacyPage() {
	const supabase = createClient();
	const { user } = useAuth();
	const [visibility, setVisibility] = useState<string>(
		user?.user_metadata.visibility ?? "public"
	);

	const handleSave = (formData: FormData, message?: string) => {
		toast.promise(
			supabase.auth.updateUser({ data: { visibility: visibility } }),
			{
				loading: "Saving...",
				success: (data) => {
					return message ?? "Your changes have been saved.";
				},
				error: "Something went wrong. Your changes couldn't be saved",
			}
		);
	};

	return (
		<>
			{user && (
				<div className="flex flex-col gap-4 pb-4 sm:gap-8">
					<AccountField
						title="Profile Visibility"
						description="You can choose to make your profile public, unlisted, or private."
						footer={`Your profile is currently ${user.user_metadata.visibility}.`}
						action={
							<Button
								size="sm"
								onClick={async () => {
									if (visibility === user.user_metadata.visibility)
										return toast.error("No changes were made.", {
											description: "Please make some changes before saving.",
										});

									if (!["public", "unlisted", "private"].includes(visibility))
										return toast.error("Invalid value.", {
											description:
												"Your visibility can only be 'public', 'unlisted' or 'private'.",
										});

									const formData = new FormData();
									formData.append("visibility", visibility);
									handleSave(formData, `Your profile is now ${visibility}.`);
								}}
							>
								Save
							</Button>
						}
					>
						<Select value={visibility} onValueChange={setVisibility}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Public" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									value="public"
									className="data-[current=true]:font-bold"
									data-current={user.user_metadata.visibility === "public"}
								>
									Public
								</SelectItem>
								<SelectItem
									value="unlisted"
									className="data-[current=true]:font-bold"
									data-current={user.user_metadata.visibility === "unlisted"}
								>
									Unlisted
								</SelectItem>
								<SelectItem
									value="private"
									className="data-[current=true]:font-bold"
									data-current={user.user_metadata.visibility === "private"}
								>
									Private
								</SelectItem>
							</SelectContent>
						</Select>
					</AccountField>
				</div>
			)}
		</>
	);
}
