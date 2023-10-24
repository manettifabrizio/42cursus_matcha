import { useState } from 'react';
import Select, { MultiValue, SingleValue } from 'react-select';

export type Option = {
	value: string;
	label: string;
};

type SelectDropdownProps = {
	disabled?: boolean;
	name?: string;
	errors?: string[];
	options: Option[];
	multi_select: boolean;
	id: string;
	setValue: React.Dispatch<React.SetStateAction<Option[]>>;
};

export default function SelectDropdown(props: SelectDropdownProps) {
	const [length, setLength] = useState(0);

	const handleChange = (
		newValue: MultiValue<Option> | SingleValue<Option>,
	) => {
		if (newValue != null) {
			if (props.multi_select) {
				props.setValue(newValue as Option[]);
				setLength((newValue as Option[]).length);
			} else props.setValue([newValue as Option]);
		} else props.setValue([]);
	};

	return (
		<div className="flex flex-col mb-2 w-full">
			<Select
				closeMenuOnSelect={!props.multi_select || length === 3}
				classNames={{
					valueContainer: () => 'gap-1',
					multiValue: () =>
						'bg-gray-700 rounded-sm px-1 hover:bg-gray-500',
					option: () =>
						'hover:bg-gray-700 px-1 rounded-sm hover:cursor-pointer',
					menu: () => {
						return 'flex border-2 rounded-md p-2 border-s-white bg-black hover:cursor-pointer mb-3 max-h-36 overflow-y-auto';
					},
					menuList: () => 'w-full',
				}}
				isSearchable={false}
				id={props.id}
				unstyled
				options={props.options}
				name={props.name}
				required
				isDisabled={props.disabled}
				className={
					'w-full border-2 rounded-md bg-inherit px-2 py-1 border-s-' +
					(props.errors && props.errors.length > 0
						? 'red-500'
						: 'white')
				}
				isMulti={props.multi_select}
				onChange={handleChange}
			/>
			{props.errors && (
				<ul className="pt-1">
					{props.errors.map((error) => (
						<li key={error} className="text-xs text-red-500">
							{error}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
