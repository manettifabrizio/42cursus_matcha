import AvailableUsers from '@/component/home/main_page/availableUsers';
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
		isLoading: isLoadingBlocks,
		isFetching: isFetchingBlocks,
	} = useGetLikesQuery();
	const [
		getProfile,
		{ isLoading: isLoadingProfiles, isFetching: isFetchingProfiles },
	] = useLazyGetProfileQuery();

	useEffect(() => {
		if (!(isLoadingBlocks || isFetchingBlocks)) {
			const likes = data.likes.by_me;

			const getBlockedUsers = async () => {
				const matchesPromises = likes.map(async (like) => {
					try {
						const match = await getProfile({
							id: like.id_user_to,
						}).unwrap();
						return match;
					} catch (error) {
						console.error(error);
						return null;
					}
				});

				return Promise.all(matchesPromises);
			};

			getBlockedUsers().then((res) => {
				const liked_users = res.filter(notEmpty);
				setUsers(liked_users);
			});
		}
	}, [data, getProfile, isLoadingBlocks, isFetchingBlocks]);

	return (
		<>
			<div className="text-3xl mb-3 text-center w-full font-bold">
				Liked Users
			</div>
			<AvailableUsers
				isFetching={isFetchingProfiles || isFetchingBlocks}
				isLoading={isLoadingProfiles || isLoadingBlocks}
				users={users}
			/>
		</>
	);
}
