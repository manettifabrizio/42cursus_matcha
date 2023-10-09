import { Profile } from '@/page/user/complete-profile';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

type BirthdayFormProps = {
	id: string;
	errors?: string[];
	setProfile: React.Dispatch<React.SetStateAction<Profile>>;
};

export default function BirthdayForm({
	id,
	errors,
	setProfile,
}: BirthdayFormProps) {
	let currentDate = new Date();

	const [myMonth, setMyMonth] = useState(currentDate);
	const [myYear, setMyYear] = useState(currentDate);
	const [myDay, setMyDay] = useState(currentDate);

	const minDate = new Date(myYear.getFullYear(), myMonth.getMonth(), 1);
	const maxDate = new Date();

	useEffect(() => {
		setMyDay(new Date(myYear.getFullYear(), myMonth.getMonth(), 1));
	}, [myMonth, myYear, setMyDay]);

	useEffect(
		() => setMyMonth(new Date(myYear.getFullYear(), myMonth.getMonth(), 1)),
		[myYear],
	);

	useEffect(() => {
		currentDate = new Date(
			myYear.getFullYear(),
			myMonth.getMonth(),
			myDay.getDay(),
		);

		setProfile((current) => ({ ...current, birthday: currentDate }));
	}, [myDay, myMonth, myYear]);

	const renderDayContents = (_: number, date: Date) => {
		if (date < minDate || date > maxDate) {
			return <span></span>;
		}
		return <span>{date.getDate()}</span>;
	};

	return (
		<>
			<h5>When is your birthday?</h5>
			<div className="flex justify-center items-center mb-1">
				<div className="pe-2">
					<label>Year</label>
					<DatePicker
						required
						className="w-full border-2 rounded-md bg-inherit p-2 cursor-pointer"
						selected={myYear}
						onChange={(date: Date) => setMyYear(date)}
						showYearPicker
						dateFormat="yyyy"
						maxDate={maxDate}
						id={`${id}-year`}
					/>
				</div>
				<div className="px-2">
					<label>Month</label>
					<DatePicker
						required
						className="w-full border-2 rounded-md bg-inherit p-2 cursor-pointer"
						showMonthYearPicker
						dateFormat="MMMM"
						selected={myMonth}
						renderCustomHeader={() => <></>}
						onChange={(date: Date) => setMyMonth(date)}
						maxDate={maxDate}
						id={`${id}-month`}
					/>
				</div>
				<div className="ps-2">
					<label>Day</label>
					<DatePicker
						required
						className="w-full border-2 rounded-md bg-inherit p-2 cursor-pointer"
						dateFormat="dd"
						selected={myDay}
						renderDayContents={renderDayContents}
						renderCustomHeader={() => <></>}
						onChange={(date: Date) => setMyDay(date)}
						maxDate={maxDate}
						id={`${id}-day`}
					/>
				</div>
			</div>
			{errors && (
				<ul className="pt-1">
					{errors.map((error) => (
						<li key={error} className="text-xs text-red-500">
							{error}
						</li>
					))}
				</ul>
			)}
			<h6 className="opacity-80">
				You must be at least 18 years old to use Matcha.
			</h6>
		</>
	);
}
