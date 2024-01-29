import ChatsList from './home_sidebar/chat/chatList';
import Matches from './home_sidebar/matches';
import Notifications from './notifications';
import ProfileMenu from './profile_sidebar/menu';

type SidebarMainContentProps = {
	url: 'home' | 'user';
	show_notifications: boolean;
};

export default function SidebarMainContent({
	url,
	show_notifications,
}: SidebarMainContentProps) {
	if (show_notifications) {
		return <Notifications />;
	} else {
		if (url === 'home') {
			return (
				<>
					<Matches />
					<ChatsList />
				</>
			);
		} else {
			return <ProfileMenu />;
		}
	}
}
