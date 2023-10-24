import MultiRangeSlider from '@/component/ui/multiRangeSlider';

type AgeFilterProps = {
	age: { min: number; max: number };
	setAge: React.Dispatch<React.SetStateAction<{ min: number; max: number }>>;
};

export default function AgeFilter({ age, setAge }: AgeFilterProps) {
	return (
		<>
			<div className="w-52 h-24 mt-3">
				<MultiRangeSlider
					min={age.min}
					max={age.max}
					onChange={({ min, max }) => {
						console.log(min, max);
						setAge({ min, max });
					}}
				/>
			</div>
		</>
	);
}
