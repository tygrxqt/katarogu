"use client";

import { useAuth } from "@/components/auth/provider";
import AccountField from "@/components/account/field";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Suspense, useState } from "react";
import Spinner from "@/components/spinner";
import Alert from "@/components/alert";
import { createClient } from "@/lib/supabase/client";

export default function AccountPrivacyPage() {
	const supabase = createClient();

	const { user, oauth, unlinkOAuth, linkOAuth } = useAuth();
	const [unlinkGithub, setUnlinkGithub] = useState(false);
	const [unlinkGoogle, setUnlinkGoogle] = useState(false);
	const [unlinkDiscord, setUnlinkDiscord] = useState(false);

	return (
		<>
			{user && (
				<div className="flex flex-col gap-4 pb-4 sm:gap-8">
					<AccountField
						title="OAuth Providers"
						description="Connect your Katarogu account with a third-party service to enable additional features."
						footer={`You can use OAuth to login to your account quickly and securely.`}
					>
						<div className="flex flex-wrap gap-3">
							{oauth.github ? (
								<Suspense fallback={<Spinner />}>
									<Button
										className="w-fit"
										variant="secondary"
										onClick={() => setUnlinkGithub(true)}
									>
										<Icons.Github className="w-4 h-4 mr-2" />
										Unlink GitHub
									</Button>
									<Alert
										title="Disconnect GitHub?"
										description="Are you sure you want to disconnect your GitHub account?"
										onSubmit={async () => await unlinkOAuth(oauth.github!)}
										onCancel={() => setUnlinkGithub(false)}
										open={unlinkGithub}
										setOpen={setUnlinkGithub}
									/>
								</Suspense>
							) : (
								<>
									<Button
										className="w-fit"
										variant="outline"
										onClick={async () => {
											await linkOAuth("github");
										}}
									>
										<Icons.Github className="w-4 h-4 mr-2" /> Connect with
										GitHub
									</Button>
								</>
							)}
							{oauth.google ? (
								<Suspense fallback={<Spinner />}>
									<Button
										className="w-fit"
										variant="secondary"
										onClick={() => setUnlinkGoogle(true)}
									>
										<Icons.Google className="w-4 h-4 mr-2" />
										Unlink Google
									</Button>
									<Alert
										title="Disconnect Google?"
										description="Are you sure you want to disconnect your Google account?"
										onSubmit={async () => await unlinkOAuth(oauth.google!)}
										onCancel={() => setUnlinkGoogle(false)}
										open={unlinkGoogle}
										setOpen={setUnlinkGoogle}
									/>
								</Suspense>
							) : (
								<>
									<Button
										className="w-fit"
										variant="outline"
										onClick={async () => {
											await linkOAuth("google");
										}}
									>
										<Icons.Google className="w-4 h-4 mr-2" /> Connect with
										Google
									</Button>
								</>
							)}

							{oauth.discord ? (
								<Suspense fallback={<Spinner />}>
									<Button
										className="w-fit"
										variant="secondary"
										onClick={() => setUnlinkDiscord(true)}
									>
										<Icons.Discord className="w-4 h-4 mr-2" />
										Unlink Discord
									</Button>
									<Alert
										title="Disconnect Discord?"
										description="Are you sure you want to disconnect your Discord account?"
										onSubmit={async () => await unlinkOAuth(oauth.discord!)}
										onCancel={() => setUnlinkDiscord(false)}
										open={unlinkDiscord}
										setOpen={setUnlinkDiscord}
									/>
								</Suspense>
							) : (
								<>
									<Button
										className="w-fit"
										variant="outline"
										onClick={async () => {
											await linkOAuth("discord");
										}}
									>
										<Icons.Discord className="w-4 h-4 mr-2" /> Connect with
										Discord
									</Button>
								</>
							)}
						</div>
					</AccountField>

					{/* <AccountCard
						title="Passkeys"
						description="Create a passkey to use as an alternative to your password."
						footer={`Note: Passkeys are in beta and may not be available to all users.`}
					>
						<div className="flex flex-row gap-4">
							<Button className="w-fit" variant="outline">
								<Icons.Passkey className="w-4 h-4 mr-2" /> Create Passkey
							</Button>
						</div>
					</AccountCard> */}
				</div>
			)}
		</>
	);
}
