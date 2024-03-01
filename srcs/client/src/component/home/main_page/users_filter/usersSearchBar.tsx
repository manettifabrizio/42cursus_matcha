import LabelInput from '@/component/ui/labelInput';

type UsersSearchBarProps = {
	setSearchValue: React.Dispatch<React.SetStateAction<string>>;
	value: string;
};

export default function UsersSearchBar({
	value,
	setSearchValue,
}: UsersSearchBarProps) {
	return (
		<div className="w-48 pe-3 mb-2">
			<LabelInput
				input_props={{
					onChange: (e) => setSearchValue(e.target.value),
					type: 'search',
					name: 'search',
					placeholder: 'Search users',
					value,
					style: {
						background:
							'url(/search.svg) no-repeat scroll 8px 12px',
						paddingLeft: '30px',
					},
				}}
			/>
		</div>
	);
}
