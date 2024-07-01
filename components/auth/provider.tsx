"use client";

import { supabase } from "@/lib/supabase";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { type User } from "@supabase/supabase-js";

export interface AuthSession {
	loggedIn: boolean;
	user: User | null;

	logIn: (email: string, password: string) => Promise<boolean>;
	register: (
		name: string,
		email: string,
		username: string,
		password: string,
		passwordConfirm: string
	) => Promise<boolean>;
	logOut: () => void;
}

export const AuthContext = React.createContext<AuthSession>({
	loggedIn: false,
	user: null,
	logIn: async () => false,
	register: async () => false,
	logOut: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [mounted, setMounted] = React.useState(false);
	const [user, setUser] = React.useState<AuthSession["user"]>(null);

	const [loggedIn, setLoggedIn] = React.useState<boolean>(false);

	useEffect(() => {
		setMounted(true);

		supabase.auth
			.getUser()
			.then((res) => {
				if (res.error) {
					console.error(res.error);
					toast.error("Failed to fetch user", {
						description: res.error.message,
					});
				} else {
					setUser(res.data.user);
				}
			})
			.catch((err) => {
				console.error(err);
				toast.error("Failed to fetch user", {
					description: "Is the server down?",
				});
			});
	});

	async function logIn(email: string, password: string) {
		let { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error(error);
			toast.error("Something went wrong!", {
				description: error.message,
			});
			return false;
		} else {
			setLoggedIn(true);
			toast.success(`Welcome back, ${data.user?.email}`);
			return true;
		}
	}

	async function register(
		name: string,
		email: string,
		username: string,
		password: string,
		passwordConfirm: string
	) {
		if (!name || name.length < 2) {
			toast.error("Invalid name", {
				description:
					"Please confirm that your name is at least 2 characters long.",
			});
			return false;
		}

		if (!email) {
			console.log(email);
			toast.error("Invalid email", {
				description: "Please provide a valid email",
			});
			return false;
		}

		if (!username) {
			toast.error("Invalid username", {
				description: "Please provide a username.",
			});
			return false;
		}

		if (password !== passwordConfirm) {
			toast.error("Invalid Credentials", {
				description: "Your passwords don't match.",
			});
			return false;
		}

		let { error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				data: {
					name: name,
					username: username,
				},
			},
		});

		if (error) {
			console.error(error);
			toast.error("Something went wrong!", {
				description: error.message,
			});
			return false;
		} else {
			toast.success("Success!", {
				description: "Please check your email for a verification link!",
			});
			return true;
		}
	}

	function logOut() {
		supabase.auth.signOut();
	}

	const value = React.useMemo(
		() => ({
			loggedIn,
			user,
			logIn,
			register,
			logOut,
		}),
		[loggedIn, logIn, register]
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
		throw new Error("useAuth must be used within a AuthProvider");
	}
	return context;
};
