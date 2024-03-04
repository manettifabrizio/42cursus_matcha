import { useCallback, useEffect, useRef } from 'react';

type MultiRangeSliderProps = {
	currentValue: { min: number; max: number };
	limits: { min: number; max: number };
	onChange: ({ min, max }: { min: number; max: number }) => void;
	disabled?: boolean;
};

export default function MultiRangeSlider({
	currentValue,
	limits,
	onChange,
	disabled,
}: MultiRangeSliderProps) {
	const range = useRef<HTMLInputElement>(null);

	// Convert to percentage
	const getPercent = useCallback(
		(value: number) =>
			Math.round(
				((value - currentValue.min) /
					(currentValue.max - currentValue.min)) *
					100,
			),
		[currentValue.min, currentValue.max],
	);

	// Set width of the range to decrease from the left side
	useEffect(() => {
		const minPercent = getPercent(currentValue.min);
		const maxPercent = getPercent(currentValue.max);

		if (range.current) {
			range.current.style.left = `${minPercent}%`;
			range.current.style.width = `${maxPercent - minPercent}%`;
		}
	}, [currentValue.min, currentValue.max, getPercent]);

	// Set width of the range to decrease from the right side
	useEffect(() => {
		const minPercent = getPercent(currentValue.min);
		const maxPercent = getPercent(currentValue.max);

		if (range.current) {
			range.current.style.width = `${maxPercent - minPercent}%`;
		}
	}, [currentValue.max, currentValue.min, getPercent]);

	return (
		<div className="relative w-full">
			<input
				required
				disabled={disabled}
				name="range-1"
				type="range"
				min={limits.min}
				max={limits.max}
				value={currentValue.min}
				onChange={(event) => {
					const value = Math.min(
						Number(event.target.value),
						currentValue.max - 1,
					);
					onChange({ max: currentValue.max, min: value });
				}}
				className="absolute h-1 w-full outline-none z-30 pointer-events-none"
			/>
			<input
				required
				disabled={disabled}
				name="range-2"
				type="range"
				min={limits.min}
				max={limits.max}
				value={currentValue.max}
				onChange={(event) => {
					const value = Math.max(
						Number(event.target.value),
						currentValue.min + 1,
					);
					onChange({ max: value, min: currentValue.min });
				}}
				className="absolute h-1 w-full outline-none z-30 pointer-events-none"
			/>

			{/* Slider */}
			<div
				ref={range}
				className="absolute border-2 border-white z-20 rounded-md"
			/>
			<div className="absolute text-white text-xs mt-3 left-0">
				{currentValue.min}
			</div>
			<div className="absolute text-white text-xs mt-3 right-0">
				{currentValue.max}
			</div>
		</div>
	);
}
