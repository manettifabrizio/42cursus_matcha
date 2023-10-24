import UsersFilter from './filters_dropdown/usersFilters';
import UsersSearchBar from './usersSearchBar';

type SearchAndFilterProps = {
	setSearchValue: React.Dispatch<React.SetStateAction<string>>;
	searchValue: string;
};

export default function SearchAndFilter({
	searchValue,
	setSearchValue,
}: SearchAndFilterProps) {
	return (
		<>
			<div className="flex justify-between items-center mx-5">
				<UsersSearchBar
					value={searchValue}
					setSearchValue={setSearchValue}
				/>
				<UsersFilter />
			</div>
		</>
	);
}
