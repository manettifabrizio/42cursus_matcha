import AvailableUsers from '@/component/home/main_page/availableUsers';
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
						console.error(error);
						return null;
					}
				});

				return Promise.all(matchesPromises);
			};

			getViews().then((res) => {
				const views = res.filter(notEmpty);
				setUsers(views);
			});
		}
	}, [data, getProfile, isLoadingActivities, isFetchingActivities]);

	return (
		<>
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
