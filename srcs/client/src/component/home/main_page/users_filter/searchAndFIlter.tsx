import { UserFilters } from '@/feature/user/types';
import UsersFilter from './filters_dropdown/usersFilters';
import UsersSearchBar from './usersSearchBar';

type SearchAndFilterProps = {
	setSearchValue: React.Dispatch<React.SetStateAction<string>>;
	searchValue: string;
	filters: UserFilters;
	setFilters: React.Dispatch<React.SetStateAction<UserFilters>>;
};

export default function SearchAndFilter({
	searchValue,
	setSearchValue,
	filters,
	setFilters,
}: SearchAndFilterProps) {
	return (
		<>
			<div className="flex justify-between items-center mx-5">
				<UsersSearchBar
					value={searchValue}
					setSearchValue={setSearchValue}
				/>
				<UsersFilter
					filters={filters}
					setFilters={setFilters}
				/>
			</div>
		</>
	);
}
