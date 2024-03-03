import ChatsList from './home_sidebar/chat/chatList';
import Matches from './home_sidebar/matches';
import Notifications from '../../notifications/notifications';
import ProfileMenu from './profile_sidebar/menu';
import { useSelector } from 'react-redux';
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

	if (show_notifications && isDesktop) {
		return <Notifications />;
	} else {
		if (url === 'user') {
			return <ProfileMenu isDesktop={isDesktop} />;
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
