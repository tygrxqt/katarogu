/* eslint-disable @next/next/no-img-element */
// Disabled eslint for img element because images are loaded from local storage, not from the web.
import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button, ButtonProps } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useAuth } from "../auth/provider";
import { ArrowDown } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

export default function BannerRemove(props: ButtonProps) {
	const { banner, removeBanner } = useAuth();
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const onSubmit = () => {
		removeBanner();
		setOpen(false);
	};

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button {...props} />
				</DialogTrigger>
				<DialogContent className="p-0 sm:max-w-[425px]">
					<DialogHeader className="p-6">
						<DialogTitle>Remove Banner</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete your banner?
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col items-center justify-between gap-4 px-6 pb-4">
						<AspectRatio ratio={4 / 1}>
							<img
								src={banner}
								width={1400}
								height={250}
								alt="banner"
								className="h-full w-full rounded-md border border-black/10 object-cover dark:border-white/10"
							/>
						</AspectRatio>
						<ArrowDown className="mx-4 h-8 w-8 text-neutral-500" />
						<AspectRatio ratio={4 / 1}>
							<img
								src={
									"https://images.unsplash.com/photo-1636955816868-fcb881e57954?q=80"
								}
								width={1400}
								height={250}
								alt="banner"
								className="h-full w-full rounded-md border border-black/10 object-cover dark:border-white/10"
							/>
						</AspectRatio>
					</div>
					<div className="flex flex-row items-center justify-between gap-4 border-t bg-neutral-200/50 dark:bg-neutral-900/50 p-4">
						<span className="text-sm text-neutral-600 dark:text-neutral-400">
							This action is not reversible.
						</span>
						<Button variant="destructive" onClick={onSubmit}>
							Confirm
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button {...props} />
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Remove Banner</DrawerTitle>
					<DrawerDescription>
						Are you sure you want to delete your banner?
					</DrawerDescription>
				</DrawerHeader>
				<div className="flex flex-col items-center justify-center gap-4 p-6">
					<AspectRatio ratio={4 / 1}>
						<img
							src={banner}
							width={1400}
							height={250}
							alt="banner"
							className="h-full w-full rounded-md border border-black/10 object-cover dark:border-white/10"
						/>
					</AspectRatio>
					<ArrowDown className="mx-4 h-8 w-8 text-neutral-500" />
					<AspectRatio ratio={4 / 1}>
						<img
							src={
								"https://images.unsplash.com/photo-1636955816868-fcb881e57954?q=80"
							}
							width={1400}
							height={250}
							alt="banner"
							className="h-full w-full rounded-md border border-black/10 object-cover dark:border-white/10"
						/>
					</AspectRatio>
				</div>
				<div className="flex w-full flex-row justify-between gap-2 border-t p-4">
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button onClick={onSubmit}>Confirm</Button>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
