import SelectDropdown, { Option } from '@/component/ui/selectDropdown';
import { tagsOptions } from '@/page/user/tags_options';
import { useEffect, useState } from 'react';
import { CompleteProfileInputProps } from '../types';

export default function TagsInput({
	disabled,
	id,
	errors,
	setProfile,
}: CompleteProfileInputProps) {
	const [value, setValue] = useState<Option[]>([]);

	useEffect(() => {
		if (value && value.length > 0)
			setProfile((current) => ({
				...current,
				tags: value.map((v) => v.value),
			}));
	}, [value]);
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
				/>
			</div>
		</div>
	);
}
