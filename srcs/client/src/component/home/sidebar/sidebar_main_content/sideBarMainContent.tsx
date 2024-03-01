import ChatsList from './home_sidebar/chat/chatList';
import Matches from './home_sidebar/matches';
import Notifications from '../../notifications/notifications';
import ProfileMenu from './profile_sidebar/menu';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startDisconnecting } from '@/feature/interactions/store.slice';
import { StoreState } from '@/core/store';

type SidebarMainContentProps = {
	show_notifications: boolean;
	isDesktop: boolean;
};

export default function SidebarMainContent({
	show_notifications,
	isDesktop,
}: SidebarMainContentProps) {
	const url = useSelector((state: StoreState) => state.interactions.url);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	if (show_notifications && isDesktop) {
		return <Notifications />;
	} else {
		if (url === 'user') {
			return (
				<>
					<ProfileMenu isDesktop={isDesktop} />
					<button
						onClick={() => {
							dispatch(startDisconnecting());
							navigate('/auth/logout', { replace: true });
						}}
						className={
							'text-center underline' + (isDesktop ? '' : ' mb-4')
						}
					>
						Logout
					</button>
				</>
			);
		} else {
			return (
				<>
					<Matches />
					<ChatsList />
				</>
			);
		}
	}
}
