import AvailableUsers from '@/component/home/main_page/availableUsers';
import { BackToMenuArrow } from '@/component/home/sidebar/sidebar_main_content/profile_sidebar/backToMenuArrow';
import {
	useGetLikesQuery,
	useLazyGetProfileQuery,
} from '@/feature/user/api.slice';
import { Profile } from '@/feature/user/types';
import { notEmpty } from '@/tool/userTools';
import { useEffect, useState } from 'react';

export function Component() {
	const [users, setUsers] = useState<Profile[]>([]);
	const {
		data = { likes: { by_me: [], to_me: [] } },
		isLoading: isLoadingLikes,
		isFetching: isFetchingLikes,
	} = useGetLikesQuery();
	const [
		getProfile,
		{ isLoading: isLoadingProfiles, isFetching: isFetchingProfiles },
	] = useLazyGetProfileQuery();

	useEffect(() => {
		if (!(isLoadingLikes || isFetchingLikes)) {
			const likes = data.likes.to_me;

			const getLikedUsers = async () => {
				const matchesPromises = likes.map(async (like) => {
					try {
						const match = await getProfile({
							id: like.id_user_from,
						}).unwrap();
						return match;
					} catch (error) {
						console.error(error);
						return null;
					}
				});

				return Promise.all(matchesPromises);
			};

			getLikedUsers().then((res) => {
				const liked_users = res.filter(notEmpty);
				setUsers(liked_users);
			});
		}
	}, [data, getProfile, isLoadingLikes, isFetchingLikes]);

	return (
		<>
			<BackToMenuArrow />
			<div className="text-3xl mb-3 text-center w-full font-bold">
				Users Likes
			</div>
			<AvailableUsers
				isFetching={isFetchingProfiles || isFetchingLikes}
				isLoading={isLoadingProfiles || isLoadingLikes}
				users={users}
			/>
		</>
	);
}
