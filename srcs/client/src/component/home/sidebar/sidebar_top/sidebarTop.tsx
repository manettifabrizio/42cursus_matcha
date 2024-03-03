import LoadingSpinner from '@/component/ui/loadingSpinner';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import SideBarPhoto from './sideBarPhoto';
import NotificationsIndicator from './notificationsIndicator';
import { URLType } from '@/feature/types';
import { TbLogout } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa6';
import { goToHome } from '@/feature/interactions/utils';
import { useDispatch } from 'react-redux';
import { startDisconnecting } from '@/feature/interactions/store.slice';

type SideBarTopProps = {
	NotificationsOpened: boolean;
	url: URLType;
};

export default function SidebarTop({
	NotificationsOpened,
	url,
}: SideBarTopProps) {
	const { data = undefined, isFetching, isLoading } = useGetProfileQuery();
	const dispatch = useDispatch();

	return (
		<div className={'relative ' + (url === 'user' ? 'my-4' : 'mb-4')}>
			{!data || isLoading || isFetching ? (
				<div className="w-full h-16 flex justify-center items-center">
					<LoadingSpinner size="sm" />
				</div>
			) : (
				<div className="flex flex-row w-full justify-between items-center">
					{url === 'user' && (
						<Link
							to="/home"
							className="flex m-3 me-8 text-xl"
							onClick={goToHome}
						>
							<FaChevronLeft />
						</Link>
					)}
					<SideBarPhoto
						url={url}
						user={data}
						show_notifications={NotificationsOpened}
					/>
					<div className="flex flex-row">
						<NotificationsIndicator
							show_notifications={NotificationsOpened}
						/>
						<div className="p-2 flex items-center justify-center">
							<Link
								onClick={() => dispatch(startDisconnecting())}
								to="/auth/logout"
							>
								<TbLogout className="text-xl" />
							</Link>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
