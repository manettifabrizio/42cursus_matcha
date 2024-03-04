type AgeFilterProps = {
	distance?: number;
	setDistance: React.Dispatch<React.SetStateAction<number>>;
};

export default function DistanceFilter({
	distance,
	setDistance,
}: AgeFilterProps) {
	return (
		<>
			<div className="w-full h-1/5 mb-2">
				Distance
				<div className="relative mt-2">
					<input
						type="range"
						onChange={(e) => setDistance(Number(e.target.value))}
						className={
							'absolute h-1 w-full outline-none z-40 pointer-events-none undefined'
						}
						min="0"
						value={distance}
					/>
					<div className="relative w-full bg-white">
						{/* Slider */}
						<div className="absolute border-2 border-white z-20 rounded-md w-full" />
						<div className="absolute text-white text-xs mt-3 left-0">
							{distance === 100 ? '100+' : distance}km
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
