import MultiRangeSlider from '@/component/ui/multiRangeSlider';

type FameFilterProps = {
	fame: { min: number; max: number };
	setFame: React.Dispatch<React.SetStateAction<{ min: number; max: number }>>;
};

export default function FameFilter({ fame, setFame }: FameFilterProps) {
	return (
		<>
			<div className="w-full h-1/5 mb-1">
				<p className="mb-2">Fame</p>
				<MultiRangeSlider
					currentValue={fame}
					limits={{ min: 1, max: 100 }}
					onChange={({ min, max }) => setFame({ min, max })}
				/>
			</div>
		</>
	);
}
