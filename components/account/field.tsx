export default function AccountField({
	title,
	description,
	children,
	footer,
	action,
}: {
	title: string;
	description: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	action?: React.ReactNode;
}) {
	return (
		<>
			<div className="flex w-full flex-col rounded-md border">
				<div className="flex flex-col gap-4 border-b p-6">
					<div className="flex flex-col gap-2">
						<h1 className="text-xl font-bold">{title}</h1>
						<p className="text-sm">{description}</p>
					</div>
					{children}
				</div>
				<div className="flex flex-row items-center justify-between gap-4 p-4">
					<span className="text-sm text-neutral-600 dark:text-neutral-400">
						{footer}
					</span>
					{action}
				</div>
			</div>
		</>
	);
}
