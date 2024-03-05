import AvailableUsers from '@/component/home/main_page/availableUsers';
import { BackToMenuArrow } from '@/component/home/sidebar/sidebar_main_content/profile_sidebar/backToMenuArrow';
import {
	useBlockedUsersQuery,
	useLazyGetProfileQuery,
} from '@/feature/user/api.slice';
import { Profile } from '@/feature/user/types';
import { notEmpty } from '@/tool/userTools';
import { useEffect, useState } from 'react';

export function Component() {
	const [users, setUsers] = useState<Profile[]>([]);
	const {
		data = { blocks: { by_me: [] } },
		isLoading: isLoadingBlocks,
		isFetching: isFetchingBlocks,
	} = useBlockedUsersQuery();
	const [
		getProfile,
		{ isLoading: isLoadingProfiles, isFetching: isFetchingProfiles },
	] = useLazyGetProfileQuery();

	useEffect(() => {
		if (!(isLoadingBlocks || isFetchingBlocks)) {
			const blocks = data.blocks.by_me;

			const getBlockedUsers = async () => {
				const matchesPromises = blocks.map(async (block) => {
					try {
						const match = await getProfile({
							id: block.id_user_to,
						}).unwrap();
						return match;
					} catch (error) {
						// console.error(error);
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
			<BackToMenuArrow />
			<div className="text-3xl mb-3 text-center w-full font-bold">
				Blocked Users
			</div>
			<AvailableUsers
				isFetching={isFetchingProfiles || isFetchingBlocks}
				isLoading={isLoadingProfiles || isLoadingBlocks}
				users={users}
			/>
		</>
	);
}
