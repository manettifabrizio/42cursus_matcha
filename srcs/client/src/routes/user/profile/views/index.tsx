import AvailableUsers from '@/component/home/main_page/availableUsers';
import { BackToMenuArrow } from '@/component/home/sidebar/sidebar_main_content/profile_sidebar/backToMenuArrow';
import {
	useGetActivitiesQuery,
	useLazyGetProfileQuery,
} from '@/feature/user/api.slice';
import { Profile } from '@/feature/user/types';
import { notEmpty } from '@/tool/userTools';
import { useEffect, useState } from 'react';

export function Component() {
	const [users, setUsers] = useState<Profile[]>([]);
	const {
		data = { activities: { by_me: [], to_me: [] } },
		isLoading: isLoadingActivities,
		isFetching: isFetchingActivities,
	} = useGetActivitiesQuery();
	const [
		getProfile,
		{ isLoading: isLoadingProfiles, isFetching: isFetchingProfiles },
	] = useLazyGetProfileQuery();

	useEffect(() => {
		const activities_to_me = data.activities.to_me;

		if (
			!(isLoadingActivities || isFetchingActivities) &&
			activities_to_me &&
			activities_to_me.length > 0
		) {
			const views = activities_to_me.filter(
				(view) => view.action === 'WATCHED_PROFILE',
			);

			const getViews = async () => {
				const matchesPromises = views.map(async (view) => {
					try {
						const match = await getProfile({
							id: view.id_user_from,
						}).unwrap();
						return match;
					} catch (error) {
						// console.error(error);
						return null;
					}
				});

				return Promise.all(matchesPromises);
			};

			getViews().then((res) => {
				const views = res.filter(notEmpty);

				const views_no_duplicates = Array.from(
					new Map(views.map((user) => [user.id, user])).values(),
				);

				setUsers(views_no_duplicates);
			});
		}
	}, [data, getProfile, isLoadingActivities, isFetchingActivities]);

	return (
		<>
			<BackToMenuArrow />
			<div className="text-3xl mb-3 text-center w-full font-bold">
				Views
			</div>
			<AvailableUsers
				isFetching={isFetchingProfiles || isFetchingActivities}
				isLoading={isLoadingProfiles || isLoadingActivities}
				users={users}
			/>
		</>
	);
}
