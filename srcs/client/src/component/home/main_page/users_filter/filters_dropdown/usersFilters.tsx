import { useEffect, useRef, useState } from 'react';
import { GoFilter } from 'react-icons/go';
import AgeFilter from './ageFilter';

export default function UsersFilter() {
	const [show, setShow] = useState(false);
	const [age, setAge] = useState({ min: 18, max: 80 });
	const [submitting, setSubmitting] = useState(false);
	const dropdownBtnRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

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
	}, []);

	return (
		<div className="relative">
			<button
				onClick={() => setShow(!show)}
				tabIndex={0}
				ref={dropdownBtnRef}
			>
				<div className="border-2 rounded-md text-2xl p-2">
					<GoFilter />
				</div>
			</button>
			<div
				ref={dropdownRef}
				className={`flex flex-col justify-evenly items-end absolute right-0 p-3 z-10 bg-black border rounded-md h-80 ${
					show ? '' : 'hidden'
				}`}
			>
				<div className="h-full">
					Age
					<AgeFilter age={age} setAge={setAge} />
					Distance 
                    Tags 
                    Fame
				</div>
				<button className="w-1/3 border rounded-md">Save</button>
			</div>
		</div>
	);
}
