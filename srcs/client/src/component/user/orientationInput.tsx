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
	errors,
	setProfile,
}: CompleteProfileInputProps) {
	const [value, setValue] = useState<Option[]>([]);

	useEffect(() => {
		if (value && value.length === 1) {
			const orientation = value[0].value as
				| 'HETEROSEXUAL'
				| 'HOMOSEXUAL'
				| 'BISEXUAL'
				| undefined;
			setProfile((current) => ({ ...current, orientation }));
		}
	}, [value]);

	return (
		<div className="mb-5">
			<h5 className="mb-1">What is your orientation?</h5>
			<div className="flex justify-center items-center cursor-pointer">
				<SelectDropdown
					disabled={disabled}
					name="gender"
					options={orientationOptions}
					errors={errors}
					multi_select={false}
					id={id}
					setValue={setValue}
				/>
			</div>
		</div>
	);
}
