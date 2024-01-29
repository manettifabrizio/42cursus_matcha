import LoadingSpinner from '@/component/ui/loadingSpinner';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import SideBarPhoto from './sideBarPhoto';
import NotificationsIndicator from './notificationsIndicator';

type SideBarTopProps = {
	NotificationsOpened: boolean;
	url: 'home' | 'user';
};

export default function SidebarTop({
	NotificationsOpened,
	url,
}: SideBarTopProps) {
	const { data = undefined, isFetching, isLoading } = useGetProfileQuery();

	return (
		<div className="relative mb-4">
			{!data || isLoading || isFetching ? (
				<div className="w-full h-16 flex justify-center items-center">
					<LoadingSpinner size="sm" />
				</div>
			) : (
				<>
					<SideBarPhoto
						url={url}
						user={data}
						show_notifications={NotificationsOpened}
					/>
					<NotificationsIndicator
						show_notifications={NotificationsOpened}
					/>
				</>
			)}
		</div>
	);
}
