"use client";

import { createClient } from "@/lib/supabase/client";
import { Provider, User, UserIdentity } from "@supabase/supabase-js";
import React from "react";
import { toast } from "sonner";
import { decode } from "base64-arraybuffer";

export interface AuthSession {
	user: User | null;
	oauth: {
		github: UserIdentity | null;
		google: UserIdentity | null;
		discord: UserIdentity | null;
	};

	avatar: string;
	banner: string;

	signIn: (email: string, password: string) => Promise<boolean>;
	signOut: (msg?: boolean) => Promise<void>;
	register: (
		name: string,
		email: string,
		username: string,
		password: string,
		passwordConfirm: string
	) => Promise<boolean>;
	signInWithOAuth: (provider: Provider) => Promise<void>;
	resetPassword: (email: string) => Promise<void>;

	linkOAuth: (provider: Provider) => Promise<void>;
	unlinkOAuth: (provider: UserIdentity) => Promise<void>;
	refreshOAuth: () => Promise<void>;

	uploadAvatar: (base64: string) => Promise<void>;
	removeAvatar: () => Promise<void>;

	uploadBanner: (base64: string) => Promise<void>;
	removeBanner: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthSession>({
	user: null,
	oauth: {
		github: null,
		google: null,
		discord: null,
	},

	avatar: "",
	banner: "",

	signIn: async () => false,
	signOut: async () => {},
	register: async () => false,
	signInWithOAuth: async () => {},
	resetPassword: async () => {},

	linkOAuth: async () => {},
	unlinkOAuth: async () => {},
	refreshOAuth: async () => {},

	uploadAvatar: async () => {},
	removeAvatar: async () => {},

	uploadBanner: async () => {},
	removeBanner: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [mounted, setMounted] = React.useState<boolean>(false);
	const [user, setUser] = React.useState<AuthSession["user"]>(null);
	const [oauth, setOauth] = React.useState<AuthSession["oauth"]>({
		github: null,
		google: null,
		discord: null,
	});

	const [avatar, setAvatar] = React.useState<AuthSession["avatar"]>("");
	const [banner, setBanner] = React.useState<AuthSession["banner"]>("");

	const signIn = async (email: string, password: string) => {
		const supabase = createClient();

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			toast.error("Something went wrong!", {
				description: error.message,
			});
			return false;
		}

		if (data.weakPassword) {
			toast.warning("Heads up!", {
				description:
					"Your password is classed as weak. Please consider updating it.",
			});
		}

		if (data) {
			setUser(data.user);

			toast.success("Success!", {
				description: `Good to see you, ${data.user.user_metadata.name}`,
			});
			return true;
		}

		return false;
	};

	async function signOut(msg: boolean = false) {
		const supabase = createClient();
		setUser(null);

		const { error } = await supabase.auth.signOut();

		if (error) {
			toast.error("Something went wrong!", {
				description: error.message,
			});
			return;
		}

		if (msg) {
			toast.success("Logged out successfully.", {
				description: "See you again soon 👋",
			});
		}
	}

	const register = async (
		name: string,
		username: string,
		email: string,
		password: string,
		passwordConfirm: string
	) => {
		let res = false;
		async function createUser() {
			if (!name || name.length < 2)
				return toast.error("Missing required field!", {
					description: "Please enter a valid name with at least 2 characters.",
				});

			if (!username || username.length < 2)
				return toast.error("Missing required field!", {
					description:
						"Please enter a valid username with at least 2 characters.",
				});

			if (!email || !email.includes("@"))
				return toast.error("Missing required field!", {
					description: "Please enter a valid email.",
				});

			if (!password || password.length < 8 || password.length > 72)
				return toast.error("Missing required field!", {
					description:
						"Please enter a valid password between 3 and 72 characters long.",
				});

			if (password !== passwordConfirm)
				return toast.error("Passwords mismatch!", {
					description: "The passwords do not match. Please try again.",
				});

			const supabase = createClient();

			await supabase.auth
				.signUp({
					email,
					password,
					options: {
						data: {
							name,
							username,
						},
					},
				})
				.then(() => {
					toast.success("Success!", {
						description: "Please check your email for a verification link.",
					});

					res = true;
				})
				.catch((err) => {
					console.error(err);
					toast.error("Something went wrong!", {
						description: err,
					});

					res = false;
				});
		}

		await createUser();

		return res;
	};

	async function signInWithOAuth(provider: Provider) {
		const supabase = createClient();

		await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
				queryParams: {
					next: window.location.pathname,
				},
			},
		});
	}

	async function linkOAuth(provider: Provider) {
		const supabase = createClient();

		if (typeof user === "undefined") {
			toast.error("You need to be logged in to link OAuth providers.");
			return;
		}

		const { error } = await supabase.auth.linkIdentity({
			provider,
			options: {
				queryParams: {
					next: "/account/providers",
				},
				redirectTo: `${window.location.origin}/account/providers`,
			},
		});
	}

	async function unlinkOAuth(provider: UserIdentity) {
		const supabase = createClient();

		const { error } = await supabase.auth.unlinkIdentity(provider);

		if (error) {
			toast.error("Failed to unlink oauth", {
				description: error.message,
			});
		} else {
			toast.success("Success!", {
				description: `Successfully unlinked ${provider.provider}`,
			});

			await refreshOAuth();
		}
	}

	async function refreshOAuth() {
		const supabase = createClient();

		const { data, error } = await supabase.auth.getUserIdentities();

		if (error) {
			console.error(error.message);
			return;
		}

		setOauth({
			github:
				data?.identities?.find((provider) => provider.provider === "github") ??
				null,
			google:
				data?.identities?.find((provider) => provider.provider === "google") ??
				null,
			discord:
				data?.identities?.find((provider) => provider.provider === "discord") ??
				null,
		});
	}

	async function resetPassword(email: string) {
		const supabase = createClient();

		toast.promise(
			supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/auth/reset`,
			}),
			{
				loading: "Sending request...",
				success: (data) => {
					return "If your email is registered, you should recieve an email shortly.";
				},
				error: (data) => {
					return "An invalid email was provided. Please try again.";
				},
			}
		);
	}

	async function uploadAvatar(base64: string) {
		const supabase = createClient();

		toast.promise(
			supabase.storage
				.from("profiles")
				.upload(`${user?.id}/avatar.png`, decode(base64), {
					contentType: "image/png",
					upsert: true,
				}),
			{
				loading: "Uploading...",
				success: (data) => {
					return "Successfully uploaded avatar.";
				},
				error: (err) => {
					return "Failed to upload your avatar.";
				},
			}
		);

		const url = supabase.storage
			.from("profiles")
			.getPublicUrl(`${user?.id}/avatar.png`);
		setAvatar(url.data.publicUrl);

		await supabase.auth.updateUser({ data: { avatar: url.data.publicUrl } });
	}

	async function removeAvatar() {
		const supabase = createClient();
		toast.promise(
			supabase.storage.from("profiles").remove([`${user?.id}/avatar.png`]),
			{
				loading: "Removing...",
				success: (data) => {
					setAvatar(
						`https://api.dicebear.com/7.x/lorelei-neutral/png?seed=${
							user?.user_metadata.username ?? user?.id
						}&radius=50`
					);
					return "Successfully removed avatar.";
				},
				error: (err) => {
					return "Failed to reset your avatar.";
				},
			}
		);

		await supabase.auth.updateUser({
			data: {
				avatar: `https://api.dicebear.com/7.x/lorelei-neutral/png?seed=${
					user?.user_metadata.username ?? user?.id
				}&radius=50`,
			},
		});
	}

	async function uploadBanner(base64: string) {
		const supabase = createClient();

		toast.promise(
			supabase.storage
				.from("profiles")
				.upload(`${user?.id}/banner.png`, decode(base64), {
					contentType: "image/png",
					upsert: true,
				}),
			{
				loading: "Uploading...",
				success: (data) => {
					return "Successfully uploaded banner.";
				},
				error: (err) => {
					return "Failed to upload your banner.";
				},
			}
		);

		const url = supabase.storage
			.from("profiles")
			.getPublicUrl(`${user?.id}/banner.png`);
		setBanner(url.data.publicUrl);

		await supabase.auth.updateUser({ data: { banner: url.data.publicUrl } });
	}

	async function removeBanner() {
		const supabase = createClient();
		toast.promise(
			supabase.storage.from("profiles").remove([`${user?.id}/banner.png`]),
			{
				loading: "Removing...",
				success: (data) => {
					setBanner(
						"https://images.unsplash.com/photo-1636955816868-fcb881e57954?q=50"
					);
					return "Successfully removed banner.";
				},
				error: (err) => {
					return "Failed to remove your banner.";
				},
			}
		);

		await supabase.auth.updateUser({
			data: {
				banner:
					"https://images.unsplash.com/photo-1636955816868-fcb881e57954?q=50",
			},
		});
	}

	React.useEffect(() => {
		const supabase = createClient();

		supabase.auth.onAuthStateChange((event, session) => {
			supabase.auth
				.getUser()
				.then((data) => {
					const user = data.data.user;
					setUser(user);
					setAvatar(
						user?.user_metadata.avatar
							? user.user_metadata.avatar
							: `https://api.dicebear.com/7.x/lorelei-neutral/png?seed=${user?.user_metadata.username}&radius=50`
					);
					setBanner(
						user?.user_metadata.banner
							? user.user_metadata.banner
							: "https://images.unsplash.com/photo-1636955816868-fcb881e57954?q=50"
					);
					setMounted(true);
					setOauth({
						github:
							data.data.user?.identities?.find(
								(provider) => provider.provider === "github"
							) ?? null,
						google:
							data.data.user?.identities?.find(
								(provider) => provider.provider === "google"
							) ?? null,
						discord:
							data.data.user?.identities?.find(
								(provider) => provider.provider === "discord"
							) ?? null,
					});
				})
				.catch((err) => {
					console.error(err);
				});
		});
	}, []);

	const value = React.useMemo(
		() => ({
			mounted,
			user,
			oauth,
			avatar,
			banner,

			signIn,
			signOut,
			register,
			signInWithOAuth,
			resetPassword,

			linkOAuth,
			unlinkOAuth,
			refreshOAuth,

			uploadAvatar,
			removeAvatar,
			uploadBanner,
			removeBanner,
		}),
		[
			user,
			oauth,
			avatar,
			banner,

			signIn,
			signOut,
			register,
			signInWithOAuth,
			resetPassword,

			linkOAuth,
			unlinkOAuth,
			refreshOAuth,

			uploadAvatar,
			removeAvatar,
			uploadBanner,
			removeBanner,
		]
	);

	return (
		<>
			<AuthContext.Provider value={value}>
				{mounted && children}
			</AuthContext.Provider>
		</>
	);
};

export const useAuth = () => {
	const context = React.useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used within a AuthProvider!");
	}
	return context;
};
