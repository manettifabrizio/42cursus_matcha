import SelectDropdown, { Option } from '@/component/ui/selectDropdown';
import { Profile } from '@/page/user/complete-profile';
import { useEffect, useState } from 'react';

type GenderFormProps = {
	id: string;
	errors?: string[];
	setProfile: React.Dispatch<React.SetStateAction<Profile>>;
};

const genderOptions: Option[] = [
	{ label: 'MALE', value: 'MALE' },
	{ label: 'FEMALE', value: 'FEMALE' },
];

export default function GenderForm({
	id,
	errors,
	setProfile,
}: GenderFormProps) {
	const [value, setValue] = useState<Option[]>([]);

	useEffect(() => {
		if (value && value.length === 1) {
			const gender = value[0].value as 'MALE' | 'FEMALE' | undefined;
			setProfile((current) => ({ ...current, gender }));
		}
	}, [value]);

	return (
		<div className="mb-5">
			<h5 className="mb-1">How do you identify?</h5>
			<div className="flex justify-center items-center cursor-pointer">
				<SelectDropdown
					name="gender"
					options={genderOptions}
					errors={errors}
					multi_select={false}
					id={id}
					setValue={setValue}
				/>
			</div>
		</div>
	);
}
