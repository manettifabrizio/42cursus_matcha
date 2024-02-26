import { GoHome } from 'react-icons/go';
import { TbHeart } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import MImage from '@/component/ui/mImage';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from '@/core/store';
import NotificationsIndicator from '../sidebar/sidebar_top/notificationsIndicator';
import {
	toggleNotifications,
	toggleSidebar,
} from '@/feature/interactions/store.slice';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import LoadingSpinner from '@/component/ui/loadingSpinner';
import { URLType } from '@/feature/types';

type BottomMenuProps = {
	url: URLType;
};

export default function BottomMenu({ url }: BottomMenuProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { data = undefined, isFetching, isLoading } = useGetProfileQuery();
	const NotificationsOpened = useSelector(
		(state: StoreState) => state.interactions.notifications_open,
	);

	const goToProfile = () => {
		if (url !== 'user') navigate('/user/profile/edit');
		dispatch(toggleSidebar(true));
		dispatch(toggleNotifications(false));
	};

	const goToMatches = () => {
		if (url !== 'home') navigate('/home');
		dispatch(toggleSidebar(true));
		dispatch(toggleNotifications(false));
	};

	const goToHome = () => {
		if (url !== 'home') navigate('/home');
		dispatch(toggleSidebar(false));
		dispatch(toggleNotifications(false));
	};

	return (
		<footer className="w-full flex flex-row justify-between items-center text-2xl px-4 py-2 border-t backdrop-blur-sm">
			{data && !isFetching && !isLoading ? (
				<button onClick={goToProfile}>
					<MImage
						src={`${data.picture?.path}`}
						alt="Profile"
						className={`rounded-full inset-0 object-cover w-6 h-6`}
					/>
				</button>
			) : (
				<LoadingSpinner size="sm" />
			)}
			<button onClick={goToMatches}>
				<TbHeart />
			</button>
			<NotificationsIndicator
				show_notifications={NotificationsOpened}
				isBottom={true}
			/>
			<button onClick={goToHome}>
				<GoHome />
			</button>
		</footer>
	);
}
