import AvailableUsers from '@/component/home/main_page/availableUsers';
import {
	useBlockedUsersQuery,
	useLazyGetProfileQuery,
} from '@/feature/user/api.slice';
import { Profile, UserFilters, initFilters } from '@/feature/user/types';
import { getSearchStr, notEmpty } from '@/tool/userTools';
import { useEffect, useState } from 'react';

export function Component() {
	const [users, setUsers] = useState<Profile[]>([]);
	const [filters, setFilters] = useState<UserFilters>(initFilters);
	const [filter_str, setFilterStr] = useState('');
	const [page, setPage] = useState(1);
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
	}, [data]);

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		// Infinite scroll works only if smart recommendation is off
		const target = e.target as HTMLDivElement;
		const bottom =
			target.scrollHeight - target.scrollTop < target.clientHeight + 50;
		if (bottom && !isFetchingProfiles && data.blocks.by_me.length > 0) {
			setPage((p) => p + 1);
			setFilterStr(getSearchStr({ ...filters, page }));
		}
	};

    console.log('blocked', data.blocks);

	return (
		<>
			<div className="text-3xl mb-3 text-center w-full font-bold">
				Blocked Users
			</div>
			<AvailableUsers
				isFetching={isFetchingProfiles || isFetchingBlocks}
				isLoading={isLoadingProfiles || isLoadingBlocks}
				users={users}
				handleScroll={handleScroll}
			/>
		</>
	);
}
