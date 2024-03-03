import SelectDropdown, { Option } from '@/component/ui/selectDropdown';
import { useEffect, useState } from 'react';
import { CompleteProfileInputProps } from '@/feature/user/types';

const genderOptions: Option[] = [
	{ label: 'MALE', value: 'MALE' },
	{ label: 'FEMALE', value: 'FEMALE' },
];

export default function GenderInput({
	disabled,
	id,
	setProfile,
	profile,
}: CompleteProfileInputProps) {
	const [value, setValue] = useState<Option[]>(
		profile.gender
			? [{ label: profile.gender, value: profile.gender }]
			: [],
	);

	useEffect(() => {
		if (value && value.length === 1) {
			const gender = value[0].value as 'MALE' | 'FEMALE';
			setProfile((current) => ({ ...current, gender }));
		}
	}, [value, setProfile]);

	return (
		<div className="mb-5">
			<h5 className="mb-1">How do you identify?</h5>
			<div className="flex justify-center items-center cursor-pointer">
				<SelectDropdown
					form="complete-profile-form"
					disabled={disabled}
					options={genderOptions}
					multi_select={false}
					id={id}
					setValue={setValue}
					value={value}
				/>
			</div>
		</div>
	);
}
