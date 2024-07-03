import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	// if "next" is in param, use it as the redirect URL
	const next = searchParams.get("next") ?? "/account/providers";

	if (code) {
		const supabase = createClient();

		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (error) {
			return NextResponse.redirect(
				`${origin}/auth/callback/error?msg=${error.message}`
			);
		}
	}

	// return the user to an error page with instructions
	return NextResponse.redirect(`${origin}${next}`);
}
