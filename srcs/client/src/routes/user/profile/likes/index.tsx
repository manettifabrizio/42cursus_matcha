import AvailableUsers from '@/component/home/main_page/availableUsers';
import { useGetUsersQuery } from '@/feature/user/api.slice';
import { Profile } from '@/feature/user/types';
import { useEffect, useState } from 'react';

export function Component() {
	const [users, setUsers] = useState<Profile[]>([]);
	const {
		data = { users: [] },
		isFetching,
		isLoading,
	} = useGetUsersQuery({ filters: '' });

	useEffect(() => {
		if (!isFetching && !isLoading) {
			const concat_users = users.concat(data.users);
			const users_no_duplicates = Array.from(
				new Map(concat_users.map((user) => [user.id, user])).values(),
			);
			setUsers(users_no_duplicates);
		}
	}, [data.users, isFetching, isLoading, users]);

	return (
		<>
			<div className="text-3xl mb-3 text-center w-full font-bold">
				Your Likes
			</div>
			<AvailableUsers
				isFetching={isFetching}
				isLoading={isLoading}
				users={users}
			/>
		</>
	);
}
