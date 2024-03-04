import SelectDropdown, { Option } from '@/component/ui/selectDropdown';
import { useEffect, useState } from 'react';
import { CompleteProfileInputProps } from '@/feature/user/types';

const orientationOptions: Option[] = [
	{ label: 'HETEROSEXUAL', value: 'HETEROSEXUAL' },
	{ label: 'HOMOSEXUAL', value: 'HOMOSEXUAL' },
	{ label: 'BISEXUAL', value: 'BISEXUAL' },
];

export default function OrientationInput({
	disabled,
	id,
	setProfile,
	profile,
}: CompleteProfileInputProps) {
	const [value, setValue] = useState<Option[]>(
		profile.orientation
			? [{ label: profile.orientation, value: profile.orientation }]
			: [],
	);

	useEffect(() => {
		if (value && value.length === 1) {
			const orientation = value[0].value as
				| 'HETEROSEXUAL'
				| 'HOMOSEXUAL'
				| 'BISEXUAL';
			setProfile((current) => ({ ...current, orientation }));
		}
	}, [value, setProfile]);

	return (
		<div className="mb-5">
			<h5 className="mb-1">What is your orientation?</h5>
			<div className="flex justify-center items-center cursor-pointer">
				<SelectDropdown
					disabled={disabled}
					options={orientationOptions}
					multi_select={false}
					id={id}
					setValue={setValue}
					value={value}
				/>
			</div>
		</div>
	);
}
