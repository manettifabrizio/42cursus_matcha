import SelectDropdown, { Option } from '@/component/ui/selectDropdown';
import { Profile } from '@/page/user/complete-profile';
import { tagsOptions } from '@/page/user/tags_options';
import { useEffect, useState } from 'react';

type TagsFormProps = {
	id: string;
	errors?: string[];
	setProfile: React.Dispatch<React.SetStateAction<Profile>>;
};

export default function TagsForm({ id, errors, setProfile }: TagsFormProps) {
	const [value, setValue] = useState<Option[]>([]);

	useEffect(() => {
		if (value && value.length > 0)
			setProfile((current) => ({
				...current,
				tags: value.map((v) => v.value),
			}));
	}, [value]);
	return (
		<>
			<h5>Select up to 4 tags to share your interests</h5>
			<div className="flex justify-center items-center">
				<SelectDropdown
					options={tagsOptions}
					errors={errors}
					multi_select={true}
					id={id}
					setValue={setValue}
				/>
			</div>
		</>
	);
}
