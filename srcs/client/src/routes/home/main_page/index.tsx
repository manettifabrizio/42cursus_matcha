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
	const [filter_str, setFilterStr] = useState('/recommandation');
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

	// On filter change reset page to 1 and users to empty array
	const onSave = (filters: UserFilters) => {
		setUsers([]);
		setPage(1);
		setFilterStr(getSearchStr({ ...filters, page: 1 }));
	};

	const onReset = () => {
		const resetFilters: UserFilters = {
			...initFilters,
			smart_recommendation: filters.smart_recommendation,
			sort: filters.sort,
		};
		setFilters(resetFilters);
		onSave(resetFilters);
	};

	useEffect(() => {
		if (!isFetching && !isLoading) {
			const concat_users = users.concat(data.users);

			const users_no_duplicates = Array.from(
				new Map(concat_users.map((user) => [user.id, user])).values(),
			);

			const users_no_likes = liked_users
				? users_no_duplicates.filter(
						(u) =>
							!liked_users.find(
								(liked_user) => liked_user.id === u.id,
							),
				  )
				: users_no_duplicates;

			setUsers(users_no_likes);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data.users, isFetching, isLoading, liked_users]);

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
				onSave={onSave}
				onReset={onReset}
			/>
			<AvailableUsers
				isFetching={isFetching}
				isLoading={isLoading}
				users={users.filter((u) =>
					u.firstname
						?.toLowerCase()
						.includes(searchValue.toLowerCase()),
				)}
				handleScroll={handleScroll}
			/>
		</>
	);
}
