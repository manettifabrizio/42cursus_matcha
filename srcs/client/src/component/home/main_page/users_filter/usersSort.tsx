/* eslint-disable react-hooks/exhaustive-deps */
import { UserFilters, UserSortCriteria } from '@/feature/user/types';
import { useEffect, useRef, useState } from 'react';
import { BsArrowDown, BsArrowUp, BsCheck } from 'react-icons/bs';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { FaWandMagic, FaWandMagicSparkles } from 'react-icons/fa6';

export type UsersSortProps = {
	setFilters: React.Dispatch<React.SetStateAction<UserFilters>>;
	onSave: (filters: UserFilters) => void;
};

const Options: { value: UserSortCriteria; label: string }[] = [
	{ value: 'age', label: 'Age' },
	{ value: 'distance', label: 'Distance' },
	{ value: 'fame', label: 'Fame' },
	{ value: 'tags', label: 'Tags' },
];

export default function UsersSort({ setFilters, onSave }: UsersSortProps) {
	const [value, setValue] = useState<UserSortCriteria | null>(null);
	const [show, setShow] = useState(false);
	const [smart_recommendation, setSmartRecommendation] = useState(true);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const dropdownBtnRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (value)
			setFilters((f) => {
				const newFilters: UserFilters = {
					...f,
					sort: `${value},${sortOrder}`,
				};
				onSave(newFilters);

				return newFilters;
			});
	}, [value, sortOrder, setFilters]);

	useEffect(() => {
		setFilters((f) => {
			const newFilters: UserFilters = {
				...f,
				smart_recommendation,
			};
			onSave(newFilters);

			return newFilters;
		});
	}, [smart_recommendation, setFilters]);

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
		<div className="relative flex me-2 sm:me-6 text-xs sm:text-sm">
			<button
				title={
					(!smart_recommendation ? 'Enable' : 'Disable') +
					' Smart Recommendation: only 25 users picked for you are shown.'
				}
				className="border-2 rounded-md p-2 text-xl sm:text-2xl hover:bg-white hover:text-black hover:border-black transition mb-2 me-2"
				onClick={() => setSmartRecommendation((s) => !s)}
			>
				{smart_recommendation ? (
					<FaWandMagicSparkles className="stroke-1" />
				) : (
					<FaWandMagic />
				)}
			</button>
			<div
				onMouseEnter={(e) => {
					e.preventDefault();
					setShow(true);
				}}
				onMouseLeave={(e) => {
					e.preventDefault();
					setShow(false);
				}}
			>
				<button
					className="border-2 p-2 rounded-md me-2 flex items-center"
					tabIndex={0}
					ref={dropdownBtnRef}
				>
					<div className="whitespace-nowrap">
						Sort by{' '}
						<strong>
							{value
								? value.charAt(0).toUpperCase() + value.slice(1)
								: ''}
						</strong>
					</div>
					<div className="text-2xl transition">
						{!show ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
					</div>
				</button>
				<div
					ref={dropdownRef}
					className={`items-end absolute right-0 mt-1 z-10 p-2 bg-black border-2 rounded-md w-40 ${
						show ? '' : 'hidden'
					}`}
				>
					<div className="flex flex-col">
						{Options.map((o) => (
							<button
								key={o.value}
								className="p-2 hover:bg-gray-600 w-full rounded-md text-start"
								onClick={() => {
									setValue(o.value);
									setShow(false);
								}}
							>
								<div className="flex flex-row items-center">
									<div
										className={
											'p-1' +
											(value !== o.value
												? ' opacity-0'
												: '')
										}
									>
										<BsCheck />
									</div>{' '}
									{o.label}
								</div>
							</button>
						))}
						<button
							disabled={value === null}
							className={
								'underline w-full p-2 ' +
								(value === null ? 'opacity-50' : '')
							}
							onClick={() => {
								setValue(null);
								setFilters((f) => {
									const newFilters = {
										...f,
										sort: undefined,
									};
									onSave(newFilters);

									return newFilters;
								});
							}}
						>
							Reset
						</button>
					</div>
				</div>
			</div>
			<button
				title={`Change sort order to ${
					sortOrder === 'asc' ? 'descending' : 'ascending'
				}`}
				className="border-2 rounded-md p-2 text-2xl hover:bg-white hover:text-black hover:border-black transition mb-2"
				onClick={() =>
					sortOrder === 'asc'
						? setSortOrder('desc')
						: setSortOrder('asc')
				}
			>
				{sortOrder === 'asc' ? <BsArrowDown /> : <BsArrowUp />}
			</button>
		</div>
	);
}
