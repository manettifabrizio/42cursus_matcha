import { CompleteProfileInputProps } from '@/feature/user/types';
import { useState } from 'react';

export default function BiographyInput({
	disabled,
	id,
	errors,
	setProfile,
	profile,
}: CompleteProfileInputProps) {
	const [value, setValue] = useState<string>(profile.biography ?? '');

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setProfile((c) => ({ ...c, biography: e.target.value }));
		setValue(e.target.value);
	};

	return (
		<div className="mb-5">
			<h5 className="mb-1">Describe yourself in a few words.</h5>
			<div className="flex justify-center items-center cursor-pointer">
				<textarea
					disabled={disabled}
					required
					className="w-full border-2 rounded-md bg-inherit p-2 h-40"
					onChange={handleChange}
					placeholder="About me..."
					id={`${id}-biography`}
					value={value}
				/>
				{errors && (
					<ul className="pt-1">
						{errors.map((error) => (
							<li key={error} className="text-xs text-red-500">
								{error}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
