import AvailableUsers from '@/component/home/main_page/availableUsers';
import { BackToMenuArrow } from '@/component/home/sidebar/sidebar_main_content/profile_sidebar/backToMenuArrow';
import { StoreState } from '@/core/store';
import { useLazyGetProfileQuery } from '@/feature/user/api.slice';
import { Profile } from '@/feature/user/types';
import { notEmpty } from '@/tool/userTools';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export function Component() {
	const [users, setUsers] = useState<Profile[]>([]);
	const users_likes = useSelector(
		(state: StoreState) => state.interactions.users_likes,
	);
	const matches = useSelector(
		(state: StoreState) => state.interactions.matches,
	);
	const [
		getProfile,
		{ isLoading: isLoadingProfiles, isFetching: isFetchingProfiles },
	] = useLazyGetProfileQuery();

	useEffect(() => {
		const likes = users_likes;

		if (!likes) return;

		const getLikedUsers = async () => {
			const matchesPromises = likes.map(async (id_user_from) => {
				try {
					const match = await getProfile({
						id: id_user_from,
					}).unwrap();
					return match;
				} catch (error) {
					// console.error(error);
					return null;
				}
			});

			return Promise.all(matchesPromises);
		};

		getLikedUsers().then((res) => {
			const liked_users = res.filter(notEmpty);

			const users_no_matches = liked_users?.filter(
				(user) =>
					matches?.find((match) => match.id === user.id) ===
					undefined,
			);
			setUsers(users_no_matches ?? []);
		});
	}, [users_likes, getProfile, matches]);

	return (
		<>
			<BackToMenuArrow />
			<div className="text-3xl mb-3 text-center w-full font-bold">
				Users Likes
			</div>
			<AvailableUsers
				isFetching={isFetchingProfiles}
				isLoading={isLoadingProfiles}
				users={users}
			/>
		</>
	);
}
