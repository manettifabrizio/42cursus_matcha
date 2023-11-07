import MultiRangeSlider from '@/component/ui/multiRangeSlider';

type AgeFilterProps = {
	age: { min: number; max: number };
	setAge: React.Dispatch<React.SetStateAction<{ min: number; max: number }>>;
};

export default function AgeFilter({ age, setAge }: AgeFilterProps) {
	return (
		<>
			<div className="w-full h-1/5 mb-2">
				<p className="mb-2">Age</p>
				<MultiRangeSlider
					currentValue={age}
					limits={{ min: 18, max: 80 }}
					onChange={({ min, max }) => setAge({ min, max })}
				/>
			</div>
		</>
	);
}
