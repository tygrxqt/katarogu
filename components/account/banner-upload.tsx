/* eslint-disable @next/next/no-img-element */
// Disabled eslint for img element because images are loaded from local storage, not from the web.
import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button, ButtonProps } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import { useAuth } from "../auth/provider";
import { randomUUID } from "crypto";
import { toast } from "sonner";

const MAX_FILE_SIZE = 12582912; // 12 MB

export default function BannerUpload(props: ButtonProps) {
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const { user, uploadBanner } = useAuth();

	const [src, setSrc] = React.useState("");
	const [completedCrop, setCompletedCrop] = React.useState<Crop | null>(null);

	const imageInputRef = React.useRef<HTMLInputElement>(null);
	const imageRef = React.useRef<HTMLImageElement>(null);

	const [crop, setCrop] = React.useState<Crop>({
		unit: "%",
		width: 50,
		height: 50,
		x: 0,
		y: 0,
	});

	function resetCrop() {
		setSrc("");
		setCrop({
			unit: "%",
			width: 50,
			height: 50,
			x: 0,
			y: 0,
		});
		imageInputRef.current?.value && (imageInputRef.current.value = "");
	}

	function onOpenChange() {
		setOpen(!open);
		// wait 1 second for the drawer to close
		setTimeout(() => resetCrop(), 1000);
	}

	function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
		const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

		const crop = centerCrop(
			makeAspectCrop(
				{
					// You don't need to pass a complete crop into
					// makeAspectCrop or centerCrop.
					unit: "%",
					width: 90,
				},
				4 / 1,
				width,
				height
			),
			width,
			height
		);

		setCrop(crop);
	}

	function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files.length > 0) {
			if (e.target.files[0].size > MAX_FILE_SIZE) {
				resetCrop();
				return toast.error("Images must be under 12 MB.");
			}
			const reader = new FileReader();
			reader.addEventListener("load", () =>
				setSrc(reader.result?.toString() || "")
			);
			reader.readAsDataURL(e.target.files[0]);

			// if the file is not at least 600x150 pixels, don't allow it
			const image = new Image();
			image.src = URL.createObjectURL(e.target.files[0]);
			image.onload = () => {
				if (image.width < 600 || image.height < 150) {
					resetCrop();
					return toast.error(
						"Please use an image that is at least 600x150 pixels."
					);
				} else {
					setOpen(true);
				}
			};
		}
	}

	async function onSubmitCrop() {
		if (completedCrop) {
			// create a canvas element to draw the cropped image
			const canvas = document.createElement("canvas");

			// get the image element
			const image = imageRef.current;

			// draw the image on the canvas
			if (image) {
				const crop = completedCrop;
				const scaleX = image.naturalWidth / image.width;
				const scaleY = image.naturalHeight / image.height;
				const ctx = canvas.getContext("2d");
				const pixelRatio = window.devicePixelRatio;
				canvas.width = crop.width * pixelRatio * scaleX;
				canvas.height = crop.height * pixelRatio * scaleY;

				if (ctx) {
					ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
					ctx.imageSmoothingQuality = "high";

					ctx.drawImage(
						image,
						crop.x * scaleX,
						crop.y * scaleY,
						crop.width * scaleX,
						crop.height * scaleY,
						0,
						0,
						crop.width * scaleX,
						crop.height * scaleY
					);
				}

				const base64Image = canvas.toDataURL(); // can be changed to jpeg/jpg etc

				const fileType = base64Image.split(";")[0].split(":")[1];

				const base64 = base64Image.split("base64,")[1];

				await uploadBanner(base64);

				onOpenChange();
			}
		}
	}

	if (isDesktop) {
		return (
			<>
				<Button onClick={() => imageInputRef.current?.click()} {...props} />
				<input
					ref={imageInputRef}
					type="file"
					accept="image/jpeg, image/png, image/gif, image/webp"
					className="hidden"
					onChange={onSelectFile}
				/>
				<Dialog open={open} onOpenChange={onOpenChange}>
					<DialogContent className="w-fit gap-0 p-0">
						<ReactCrop
							crop={crop}
							onChange={(_, p) => setCrop(p)}
							onComplete={(c, _) => setCompletedCrop(c)}
							aspect={4 / 1}
							minHeight={100}
							keepSelection
						>
							<img
								alt="Cropper"
								src={src}
								onLoad={onImageLoad}
								ref={imageRef}
								className="rounded-t-lg"
							/>
						</ReactCrop>
						<div className="flex w-full flex-row justify-between gap-2 border-t p-4">
							<Button variant="outline" onClick={onOpenChange}>
								Cancel
							</Button>
							<Button onClick={async () => await onSubmitCrop()}>Save</Button>
						</div>
					</DialogContent>
				</Dialog>
			</>
		);
	}

	return (
		<>
			<Button onClick={() => imageInputRef.current?.click()} {...props} />
			<input
				ref={imageInputRef}
				type="file"
				accept="image/jpeg, image/png, image/gif, image/webp"
				className="hidden"
				onChange={onSelectFile}
			/>
			<Drawer open={open} dismissible={false}>
				<DrawerContent handle={false}>
					<ReactCrop
						crop={crop}
						onChange={(_, p) => setCrop(p)}
						onComplete={(c, _) => setCompletedCrop(c)}
						aspect={3 / 1}
						minHeight={50}
						keepSelection
					>
						<img
							alt="Cropper"
							src={src}
							onLoad={onImageLoad}
							ref={imageRef}
							className="rounded-t-lg"
						/>
					</ReactCrop>
					<div className="flex w-full flex-row justify-between gap-2 border-t p-4">
						<Button variant="outline" onClick={onOpenChange}>
							Cancel
						</Button>
						<Button onClick={onSubmitCrop}>Save</Button>
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
}
