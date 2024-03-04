import { useState } from 'react';
import Select, { MultiValue, SingleValue } from 'react-select';

export type Option = {
	value: string;
	label: string;
};

type SelectDropdownProps = {
	isSearchable?: boolean;
	size?: 'sm' | 'md';
	disabled?: boolean;
	name?: string;
	errors?: string[];
	options: Option[];
	multi_select?: boolean;
	id: string;
	setValue: React.Dispatch<React.SetStateAction<Option[]>>;
	value?: Option[];
	placeholder?: string;
	form?: string;
};

export default function SelectDropdown({
	isSearchable,
	size = 'md',
	disabled,
	name,
	errors,
	options,
	multi_select = false,
	id,
	setValue,
	value,
	placeholder,
	form,
}: SelectDropdownProps) {
	const [length, setLength] = useState(0);

	const handleChange = (
		newValue: MultiValue<Option> | SingleValue<Option>,
	) => {
		if (newValue != null) {
			if (multi_select) {
				setValue(newValue as Option[]);
				setLength((newValue as Option[]).length);
			} else setValue([newValue as Option]);
		} else setValue([]);
	};

	const px = `px-${size === 'md' ? '2' : '3'}`;

	return (
		<div className={'relative flex flex-col mb-2 w-full text-' + size}>
			<Select
				closeMenuOnSelect={!multi_select || length === 3}
				classNames={{
					valueContainer: () => 'cursor-pointer gap-1 ' + px,
					indicatorsContainer: () => 'gap-1 ' + px,
					multiValue: () =>
						'border rounded-xl px-2 hover:bg-gray-800',
					option: () =>
						'hover:bg-gray-800 px-1 rounded-sm hover:cursor-pointer',
					menu: () =>
						'flex border-2 rounded-md p-2 border-s-white bg-black hover:cursor-pointer mb-3 max-h-36 ',
					menuList: () => 'w-full no-scrollbar',
					placeholder: () => 'opacity-80',
				}}
				isSearchable={isSearchable ?? false}
				id={id}
				unstyled
				options={options}
				placeholder={placeholder}
				name={name}
				form={form}
				required
				isDisabled={disabled}
				className={
					`w-full border-2 rounded-md bg-inherit py-1 border-s-` +
					(errors && errors.length > 0 ? 'red-500' : 'white')
				}
				isMulti={multi_select}
				onChange={handleChange}
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
	);
}
