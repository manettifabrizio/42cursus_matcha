import SelectDropdown, { Option } from '@/component/ui/selectDropdown';
import { tagsOptions } from '@/routes/user/tags_options';
import { useEffect, useState } from 'react';
import { CompleteProfileInputProps } from '@/feature/user/types';

export default function TagsInput({
	disabled,
	id,
	errors,
	setProfile,
	profile,
}: CompleteProfileInputProps) {
	const [value, setValue] = useState<Option[]>(
		profile.tags.length > 0
			? profile.tags.map((t) => ({ label: t, value: t }))
			: [],
	);

	useEffect(() => {
		if (value && value.length > 0)
			setProfile((current) => ({
				...current,
				tags: value.map((v) => v.value),
			}));
	}, [value, setProfile]);
	return (
		<div className="mb-5">
			<h5 className="mb-1">
				Select up to 4 tags to share your interests
			</h5>
			<div className="flex justify-center items-center">
				<SelectDropdown
					disabled={disabled}
					name="tags"
					options={tagsOptions}
					errors={errors}
					multi_select={true}
					id={id}
					setValue={setValue}
					value={value}
				/>
			</div>
		</div>
	);
}
