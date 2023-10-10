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
		if (value && value.length === 1)
			setProfile((current) => ({ ...current, gender: value[0].value }));
	}, [value]);

	return (
		<>
			<h5>How do you identify?</h5>
			<div className="flex justify-center items-center">
				<SelectDropdown
					name="gender"
					options={genderOptions}
					errors={errors}
					multi_select={false}
					id={id}
					setValue={setValue}
				/>
			</div>
		</>
	);
}
