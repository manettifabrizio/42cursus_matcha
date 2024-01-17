import { useEffect, useRef, useState } from 'react';
import { GoFilter } from 'react-icons/go';
import AgeFilter from './ageFilter';
import DistanceFilter from './distanceFilter';
import TagsFilter from './tagsFilter';
import FameFilter from './fameFilter';
import { UserFilters, initFilters } from '@/feature/user/types';
import { AiOutlineClose } from 'react-icons/ai';

export type UserFiltersProps = {
	filters: UserFilters;
	setFilters: React.Dispatch<React.SetStateAction<UserFilters>>;
};

export default function UsersFilter({ filters, setFilters }: UserFiltersProps) {
	const [show, setShow] = useState(false);
	const [age, setAge] = useState({
		min: initFilters.age_min,
		max: initFilters.age_max,
	});
	const [distance, setDistance] = useState(initFilters.distance_max);
	const [tags, setTags] = useState(initFilters.tags_max);
	const [fame, setFame] = useState({
		min: initFilters.fame_min,
		max: initFilters.fame_max,
	});

	const dropdownBtnRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const resetFilters = () => {
		setAge({ min: initFilters.age_min, max: initFilters.age_max });
		setDistance(initFilters.distance_max);
		setTags(initFilters.tags_max);
		setFame({ min: initFilters.fame_min, max: initFilters.fame_max });
	};

	const isResetDisabled = () =>
		JSON.stringify(filters) === JSON.stringify(initFilters);

	useEffect(() => {
		setFilters((c) => ({
			...c,
			age_min: age.min,
			age_max: age.max,
			distance_min: 1,
			distance_max: distance,
			tags_min: 0,
			tags_max: tags,
			fame_min: fame.min,
			fame_max: fame.max,
		}));
	}, [age, distance, tags, fame, setFilters]);

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				dropdownBtnRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				!dropdownBtnRef.current.contains(event.target as Node)
			)
				setShow(false);
		};

		window.addEventListener('mousedown', handleOutsideClick);

		return () => {
			window.removeEventListener('mousedown', handleOutsideClick);
		};
	});

	return (
		<>
			<div className="relative">
				<button
					onClick={() => setShow(!show)}
					tabIndex={0}
					ref={dropdownBtnRef}
				>
					<div className="border-2 rounded-md text-2xl p-2 hover:bg-white hover:text-black hover:border-black transition">
						{show ? <AiOutlineClose /> : <GoFilter />}
					</div>
				</button>
				<div
					ref={dropdownRef}
					className={`items-end absolute right-0 px-3 py-2 z-10 bg-black border-2 rounded-md w-60 h-72 ${
						show ? '' : 'hidden'
					}`}
				>
					<AgeFilter
						age={{ min: filters.age_min, max: filters.age_max }}
						setAge={setAge}
					/>
					<DistanceFilter
						distance={filters.distance_max}
						setDistance={setDistance}
					/>
					<TagsFilter setTags={setTags} tags={filters.tags_max} />
					<FameFilter
						setFame={setFame}
						fame={{ min: filters.fame_min, max: filters.fame_max }}
					/>
					<button
						disabled={isResetDisabled()}
						className={
							'underline w-full ' +
							(isResetDisabled() ? 'opacity-50' : '')
						}
						onClick={resetFilters}
					>
						Reset
					</button>
				</div>
			</div>
		</>
	);
}
