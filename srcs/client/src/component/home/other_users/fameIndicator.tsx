export default function FameIndicator({
	fame,
	sidebar = false,
}: {
	sidebar?: boolean;
	fame: number;
}) {
	return (
		<div className={'flex flex-col text-xl ' + (sidebar ? 'my-2' : 'mb-9')}>
			<div className="relative mt-2" title={`Fame: ${fame}`}>
				<input
					type="range"
					className={
						'absolute h-2 w-full outline-none z-40 pointer-events-none'
					}
					min="1"
					max="100"
					value={fame}
					disabled
				/>
				{/* Slider */}
				<div className="absolute h-2 bg-gradient-to-r to-red-600 from-amber-400 z-20 rounded-md w-full" />
			</div>
		</div>
	);
}
