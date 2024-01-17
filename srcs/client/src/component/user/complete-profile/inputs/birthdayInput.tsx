import { CompleteProfileInputProps } from '@/feature/user/types';

export default function BirthdayInput({
	disabled,
	id,
	errors,
	setProfile,
	profile,
}: CompleteProfileInputProps) {
	const currentDate = new Date().toISOString().split('T')[0];

	const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProfile((c) => ({ ...c, birthdate: e.target.value }));
	};

	return (
		<div className="mb-5">
			<h5 className="mb-1">When is your birthday?</h5>
			<div className="flex flex-col justify-center items-center mb-1 w-full">
				<input
					required
					className="w-full border-2 rounded-md bg-inherit p-2 cursor-pointer"
					onChange={onDateChange}
					max={currentDate}
					id={`${id}-year`}
					type="date"
					disabled={disabled}
					value={profile.birthdate}
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
