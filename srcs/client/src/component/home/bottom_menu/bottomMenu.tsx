import { GoHome } from 'react-icons/go';
import { TbHeart } from 'react-icons/tb';
import MImage from '@/component/ui/mImage';
import { useSelector } from 'react-redux';
import { StoreState } from '@/core/store';
import NotificationsIndicator from '../sidebar/sidebar_top/notificationsIndicator';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import LoadingSpinner from '@/component/ui/loadingSpinner';
import {
	goToHome,
	goToMatches,
	goToProfileSettings,
} from '@/feature/interactions/utils';
import { Link } from 'react-router-dom';

export default function BottomMenu() {
	const { data = undefined, isFetching, isLoading } = useGetProfileQuery();
	const NotificationsOpened = useSelector(
		(state: StoreState) => state.interactions.notifications_open,
	);

	return (
		<footer className="w-full flex flex-row justify-between items-center text-2xl px-4 py-2 border-t backdrop-blur-sm">
			{data && !isFetching && !isLoading ? (
				<Link onClick={goToProfileSettings} to="/user/edit">
					<MImage
						src={`${data.picture?.path}`}
						alt="Profile"
						className={`rounded-full inset-0 object-cover w-6 h-6`}
					/>
				</Link>
			) : (
				<LoadingSpinner size="sm" />
			)}
			<Link onClick={goToMatches} to="/home">
				<TbHeart />
			</Link>
			<NotificationsIndicator
				show_notifications={NotificationsOpened}
				isBottom={true}
			/>
			<Link onClick={goToHome} to="/home">
				<GoHome />
			</Link>
		</footer>
	);
}
