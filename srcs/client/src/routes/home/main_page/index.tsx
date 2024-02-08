import { Profile, UserFilters, initFilters } from '@/feature/user/types';
import AvailableUsers from '@/component/home/main_page/availableUsers';
import { useEffect, useState } from 'react';
import SearchAndFilter from '@/component/home/main_page/users_filter/searchAndFIlter';
import { useGetUsersQuery } from '@/feature/user/api.slice';
import { getSearchStr } from '@/tool/userTools';
import { useSelector } from 'react-redux';
import { StoreState } from '@/core/store';

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
	const liked_users = useSelector(
		(state: StoreState) => state.interactions.liked_users,
	);

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

			const users_no_likes = users_no_duplicates.filter(
				(u) => !liked_users.find((l) => l.id === u.id),
			);

			setUsers(users_no_likes);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data.users, isFetching, isLoading]);

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
		<>
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
					u.firstname?.toLowerCase().includes(searchValue),
				)}
				handleScroll={handleScroll}
			/>
		</>
	);
}
