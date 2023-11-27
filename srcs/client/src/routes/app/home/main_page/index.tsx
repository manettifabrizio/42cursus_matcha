import { Profile, UserFilters, initFilters } from '@/feature/user/types';
import AvailableUsers from '@/component/home/main_page/availableUsers';
import { useEffect, useState } from 'react';
import MatchaLogo from '@/component/ui/matchaLogo';
import SearchAndFilter from '@/component/home/main_page/users_filter/searchAndFIlter';
import { useGetUsersQuery } from '@/feature/user/api.slice';
import { getSearchStr } from '@/tool/userTools';

export function Component() {
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
			setUsers([]);
			setPage(1);
			setFilterStr(getSearchStr({ ...filters, page: 1 }));
		},
		[filters],
	);
	useEffect(() => {
		if (!isFetching && !isLoading) {
			const concat_users = users.concat(data.users);
			const users_no_duplicates = Array.from(
				new Map(concat_users.map((user) => [user.id, user])).values(),
			);
			setUsers(users_no_duplicates);
		}
	}, [data.users]);

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		// Infinite scroll works only if smart recommendation is off
		if (!filters.smart_recommendation) {
			const target = e.target as HTMLDivElement;
			const bottom =
				target.scrollHeight - target.scrollTop <
				target.clientHeight + 50;
			if (bottom && !isFetching && data.users.length > 0) {
				setPage((p) => p + 1);
				setFilterStr(getSearchStr({ ...filters, page }));
			}
		}
	};

	return (
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
	);
}
