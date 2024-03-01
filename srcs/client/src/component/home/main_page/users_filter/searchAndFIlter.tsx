import { UserFilters } from '@/feature/user/types';
import UsersFilter from './filters_dropdown/usersFilters';
import UsersSearchBar from './usersSearchBar';
import UsersSort from './usersSort';

type SearchAndFilterProps = {
	setSearchValue: React.Dispatch<React.SetStateAction<string>>;
	searchValue: string;
	filters: UserFilters;
	setFilters: React.Dispatch<React.SetStateAction<UserFilters>>;
	onSave: (filters: UserFilters) => void;
	onReset: () => void;
};

export default function SearchAndFilter({
	searchValue,
	setSearchValue,
	filters,
	setFilters,
	onSave,
	onReset,
}: SearchAndFilterProps) {
	return (
		<>
			<div className="flex justify-between items-center mx-2 sm:mx-5">
				<UsersSearchBar
					value={searchValue}
					setSearchValue={setSearchValue}
				/>
				<div className="flex flex-row justify-end">
					<UsersSort setFilters={setFilters} onSave={onSave} />
					<UsersFilter
						filters={filters}
						setFilters={setFilters}
						onSave={onSave}
						onReset={onReset}
					/>
				</div>
			</div>
		</>
	);
}
