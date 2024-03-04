import SelectDropdown, { Option } from '@/component/ui/selectDropdown';
import { CompleteProfileInputProps } from '@/feature/user/types';
import { isDateValid } from '@/tool/userTools';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const dayOptions: Option[] = Array.from(Array(31).keys()).map((day) => ({
	value: `${day + 1}`,
	label: `${day + 1}`,
}));

const monthOptions: Option[] = [
	{ value: '1', label: 'January' },
	{ value: '2', label: 'February' },
	{ value: '3', label: 'March' },
	{ value: '4', label: 'April' },
	{ value: '5', label: 'May' },
	{ value: '6', label: 'June' },
	{ value: '7', label: 'July' },
	{ value: '8', label: 'August' },
	{ value: '9', label: 'September' },
	{ value: '10', label: 'October' },
	{ value: '11', label: 'November' },
	{ value: '12', label: 'December' },
];

const currentYear = new Date().getFullYear();
const startYear = currentYear - 118;

const yearOptions: Option[] = Array.from(Array(100).keys()).map((year) => ({
	value: `${startYear + year}`,
	label: `${startYear + year}`,
}));

export default function BirthdayInput({
	disabled,
	id,
	errors,
	setProfile,
	profile,
}: CompleteProfileInputProps) {
	const [day, setDay] = useState<Option[]>([]);
	const [month, setMonth] = useState<Option[]>([]);
	const [year, setYear] = useState<Option[]>([]);

	useEffect(() => {
		if (profile.birthdate) {
			const date = new Date(profile.birthdate);

			setDay([
				{ value: `${date.getDate()}`, label: `${date.getDate()}` },
			]);
			setMonth([
				{
					value: `${date.getMonth() + 1}`,
					label: monthOptions[date.getMonth()].label,
				},
			]);
			setYear([
				{
					value: `${date.getFullYear()}`,
					label: `${date.getFullYear()}`,
				},
			]);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (day.length === 0 || month.length === 0 || year.length === 0) return;
		if (isDateValid(day[0].value, month[0].value, year[0].value)) {
			const date = new Date(
				Number(year[0].value),
				Number(month[0].value) - 1,
				Number(day[0].value),
			);

			setProfile((c) => ({
				...c,
				birthdate: date.toISOString().split('T')[0],
			}));
		} else toast.error('Invalid date');
	}, [day, month, year, setProfile]);

	return (
		<div className="mb-5">
			<h5 className="mb-1">When is your birthday?</h5>
			<div className="flex flex-row justify-center items-center gap-3 mb-1 w-full">
				<SelectDropdown
					id={id}
					disabled={disabled}
					options={dayOptions}
					setValue={setDay}
					placeholder="Day"
					value={day}
				/>
				<SelectDropdown
					id={id}
					disabled={disabled}
					options={monthOptions}
					setValue={setMonth}
					placeholder="Month"
					value={month}
				/>
				<SelectDropdown
					id={id}
					disabled={disabled}
					options={yearOptions.toReversed()}
					setValue={setYear}
					placeholder="Year"
					value={year}
				/>
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
		</div>
	);
}
