"use client";

import { useAuth } from "@/components/auth/provider";

export default function ProfileMangaList() {
	const { user } = useAuth();

	return (
		<>
			{user && (
				<>
					<div className="grid h-full w-full grid-cols-1 gap-6 py-4 xs:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"></div>
				</>
			)}
		</>
	);
}
