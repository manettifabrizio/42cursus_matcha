import React, { InputHTMLAttributes, useEffect, useState } from 'react';

type LabelInputProps = {
	title?: boolean;
	errors_props?: string[];
	input_props: InputHTMLAttributes<HTMLInputElement>;
};

export default function LabelInput({
	title = false,
	errors_props,
	input_props,
}: LabelInputProps) {
	const [errors, setErrors] = useState<string[]>([]);

	useEffect(() => {
		setErrors(errors_props ?? []);
	}, [errors_props]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (input_props.onChange) {
			input_props.onChange(e);
		}
		setErrors([]);
	};

	return (
		<div className={'flex flex-col w-full ' + (title === true && 'mb-5')}>
			{title === true && input_props.placeholder && (
				<h5 className="mb-1">{input_props.placeholder}</h5>
			)}
			<input
				{...input_props}
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
