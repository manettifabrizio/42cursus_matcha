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
	const [filter_str, setFilterStr] = useState('');
	const [page, setPage] = useState(1);
	const [users, setUsers] = useState<Profile[]>([]);
	const {
		data = { users: [] },
		isFetching,
		isLoading,
	} = useGetUsersQuery({ filters: filter_str });

	useEffect(
		// On filter change reset page to 1 and users to empty array
		() => {
			console.log('setUsers');
			setUsers([]);
			setFilterStr(getSearchStr({ ...filters, page: 1 }));
		},
		[filters],
	);
	useEffect(() => {
		if (!isFetching && !isLoading) setUsers(users.concat(data.users));
	}, [data.users]);

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const target = e.target as HTMLDivElement;
		const bottom =
			target.scrollHeight - target.scrollTop < target.clientHeight + 50;
		if (bottom && !isFetching && data.users.length > 0) {
			setPage((p) => p + 1);
			setFilterStr(getSearchStr({ ...filters, page }));
		}
	};

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
					handleScroll={handleScroll}
				/>
			</div>
		</div>
	);
}
