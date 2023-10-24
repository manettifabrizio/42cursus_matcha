import { InputHTMLAttributes, useEffect, useState } from 'react';

type LabelInputProps = {
	setExternalValue?: React.Dispatch<React.SetStateAction<string>>;
	errors?: string[];
	input_props: InputHTMLAttributes<HTMLInputElement>;
};

export default function LabelInput(props: LabelInputProps) {
	const [errors, setErrors] = useState<string[]>([]);

	useEffect(() => {
		setErrors(props.errors ?? []);
	}, [props.errors]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (props.setExternalValue) {
			props.setExternalValue(e.target.value);
		}
		setErrors([]);
	};

	return (
		<div
			className={
				'flex flex-col w-full ' + (errors.length > 0 ? 'mb-2' : '')
			}
		>
			<input
				{...props.input_props}
				className={
					'w-full border-2 cursor-pointer rounded-md bg-inherit p-2 border-' +
					(errors.length > 0 ? 'red-500' : 'white')
				}
				onChange={handleChange}
			/>
			{errors.length > 0 && (
				<ul className="pt-1">
					{errors.map((error) => (
						<li key={error} className="text-xs text-red-500">
							{error}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
