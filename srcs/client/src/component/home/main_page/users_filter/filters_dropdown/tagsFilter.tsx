type FameFilterProps = {
	tags: number;
	setTags: React.Dispatch<React.SetStateAction<number>>;
};

export default function TagsFilter({ tags, setTags }: FameFilterProps) {
	return (
		<>
			<div className="w-full h-1/5 mb-2">
				Tags in common
				<div className="relative mt-2">
					<input
						type="range"
						onChange={(e) => setTags(Number(e.target.value))}
						className={
							'absolute h-1 w-full outline-none z-40 pointer-events-none undefined'
						}
						min="0"
						max="4"
						value={tags}
					/>
					<div className="relative w-full bg-white">
						{/* Slider */}
						<div className="absolute border-2 border-white z-20 rounded-md w-full" />
						<div className="absolute text-white text-xs mt-3 left-0">
							{tags}/4
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
