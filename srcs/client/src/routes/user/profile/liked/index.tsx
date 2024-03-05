import AvailableUsers from '@/component/home/main_page/availableUsers';
import { BackToMenuArrow } from '@/component/home/sidebar/sidebar_main_content/profile_sidebar/backToMenuArrow';
import { StoreState } from '@/core/store';
import { Profile } from '@/feature/user/types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export function Component() {
	const [users, setUsers] = useState<Profile[]>([]);

	const liked_users = useSelector(
		(state: StoreState) => state.interactions.liked_users,
	);
	const matches = useSelector(
		(state: StoreState) => state.interactions.matches,
	);

	useEffect(() => {
		const users_no_matches = liked_users?.filter(
			(user) =>
				matches?.find((match) => match.id === user.id) === undefined,
		);

		setUsers(users_no_matches ?? []);
	}, [liked_users, matches]);

	return (
		<>
			<BackToMenuArrow />
			<div className="text-3xl mb-3 text-center w-full font-bold">
				Liked Users
			</div>
			<AvailableUsers users={users} />
		</>
	);
}
