import { InputHTMLAttributes, useEffect, useState } from 'react';

type LabelInputProps = {
	errors?: string[];
	input_props: InputHTMLAttributes<HTMLInputElement>;
};

export default function LabelInput(props: LabelInputProps) {
	const [errors, setErrors] = useState<string[]>([]);

	useEffect(() => {
		setErrors(props.errors ?? []);
	}, [props.errors]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setErrors([]);
	};

	return (
		<div className="flex flex-col mb-2 w-full">
			<input
				{...props.input_props}
				className={
					'w-full border-2 rounded-md bg-inherit p-2 border-' +
					(errors.length > 0 ? 'red-500' : 'white')
				}
				onChange={handleChange}
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
	);
}
