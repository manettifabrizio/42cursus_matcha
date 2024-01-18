import { StoreState, store } from '@/core/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { startDisconnecting } from '@/feature/interactions/store.slice';
import { useEffect, useState } from 'react';
import SidebarMainContent from './sideBarMainContent';
import { useSelector } from 'react-redux';
import SidebarTop from './sidebarTop';

export default function SideBar() {
	const [url, setUrl] = useState<'home' | 'user'>('home');
	const location_state = useLocation();
	const navigate = useNavigate();
	const NotificationsOpened = useSelector(
		(state: StoreState) => state.interactions.notifications_opened,
	);

	useEffect(() => {
		if (location_state.pathname.startsWith('/home')) setUrl('home');
		else if (location_state.pathname.startsWith('/user/profile'))
			setUrl('user');
	}, [location_state]);

	return (
		<div className="w-72 h-screen fixed left-0 border-r ">
			<div className="flex flex-col p-4 h-full">
				{/* Profile section */}
				<SidebarTop
					url={url}
					NotificationsOpened={NotificationsOpened}
				/>

				<SidebarMainContent
					url={url}
					show_notifications={NotificationsOpened}
				/>

				{/* Logout Button */}
				<button
					onClick={() => {
						store.dispatch(startDisconnecting());
						navigate('/auth/logout', { replace: true });
					}}
					className="text-center underline"
				>
					Logout
				</button>
			</div>
		</div>
	);
}
