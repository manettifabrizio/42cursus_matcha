import { Profile, UserFilters, initFilters } from '@/feature/user/types';
import AvailableUsers from './availableUsers';
import { useEffect, useState } from 'react';
import MatchaLogo from '@/component/ui/matchaLogo';
import SearchAndFilter from './users_filter/searchAndFIlter';
import { useGetUsersQuery } from '@/feature/user/api.slice';
import { getSearchStr } from '@/tool/userTools';

export default function MainPage() {
	const [searchValue, setSearchValue] = useState('');
	const [filters, setFilters] = useState<UserFilters>(initFilters);
	const [filter_str, setFilterStr] = useState('?');
	const {
		data = { users: [] },
		isFetching,
		isLoading,
	} = useGetUsersQuery({ filters: filter_str });

	useEffect(() => {
		setFilterStr(getSearchStr(filters));
	}, [filters]);

	const users: Profile[] = data.users;

	return (
		<div className="ml-72 h-full">
			<div className="flex justify-between flex-col w-full h-full">
				<MatchaLogo to="/home" />
				<SearchAndFilter
					searchValue={searchValue}
					setSearchValue={setSearchValue}
					filters={filters}
					setFilters={setFilters}
				/>
				<AvailableUsers
					isFetching={isFetching}
					isLoading={isLoading}
					users={users.filter((u) =>
						u.firstname.toLowerCase().includes(searchValue),
					)}
				/>
			</div>
		</div>
	);
}
