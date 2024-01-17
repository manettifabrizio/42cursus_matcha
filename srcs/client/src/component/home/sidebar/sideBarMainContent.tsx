import ChatsList from './home_sidebar/chats';
import Matches from './home_sidebar/matches';
import Notifications from './sidebar_main_content/notifications';
import ProfileMenu from './sidebar_main_content/profile_sidebar/menu';

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
