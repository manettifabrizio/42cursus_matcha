import { UserFilters, UserSortCriteria } from '@/feature/user/types';
import { useEffect, useRef, useState } from 'react';
import { BsArrowDown, BsArrowUp, BsCheck } from 'react-icons/bs';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

export type UsersSortProps = {
	setFilters: React.Dispatch<React.SetStateAction<UserFilters>>;
};

const Options: { value: UserSortCriteria; label: string }[] = [
	{ value: 'age', label: 'Age' },
	{ value: 'distance', label: 'Distance' },
	{ value: 'fame', label: 'Fame' },
	{ value: 'tags', label: 'Tags' },
];

export default function UsersSort({ setFilters }: UsersSortProps) {
	const [value, setValue] = useState<UserSortCriteria | null>(null);
	const [show, setShow] = useState(false);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const dropdownBtnRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (value) {
			setFilters((f) => ({ ...f, sort: `${value},${sortOrder}` }));
		}
	}, [value, sortOrder]);

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
		<div className="relative flex me-6">
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
					className="border-2 p-2 rounded-md me-2 flex"
					tabIndex={0}
					ref={dropdownBtnRef}
				>
					<div>
						Sort by <strong>{value ?? value}</strong>
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
								className="p-2 hover:bg-gray-600 w-full rounded-md text-start"
								onClick={() => setValue(o.value)}
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
							className="underline w-full p-2"
							onClick={() => {
								setValue(null);
							}}
						>
							Reset
						</button>
					</div>
				</div>
			</div>
			<button
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