import { StoreState, store } from '@/core/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { startDisconnecting } from '@/feature/interactions/store.slice';
import { useEffect } from 'react';
import SidebarMainContent from './sidebar_main_content/sideBarMainContent';
import { useSelector } from 'react-redux';
import SidebarTop from './sidebar_top/sidebarTop';

type SideBarProps = {
	isDesktop: boolean;
	setUrl: React.Dispatch<React.SetStateAction<'home' | 'user'>>;
	url: 'home' | 'user';
};

export default function SideBar({ isDesktop, setUrl, url }: SideBarProps) {
	const location_state = useLocation();
	const navigate = useNavigate();
	const NotificationsOpened = useSelector(
		(state: StoreState) => state.interactions.notifications_open,
	);

	useEffect(() => {
		if (location_state.pathname.startsWith('/home')) setUrl('home');
		else if (location_state.pathname.startsWith('/user/profile'))
			setUrl('user');
	}, [location_state, setUrl]);

	return (
		<div
			className={
				'w-full sm:w-72 h-full ' +
				(isDesktop ? 'fixed left-0 sm:border-r' : '')
			}
		>
			<div
				className={
					'flex flex-col h-full ' + (isDesktop ? 'p-4' : 'px-4 pt-4')
				}
			>
				{/* Profile section */}
				{isDesktop && (
					<SidebarTop
						url={url}
						NotificationsOpened={NotificationsOpened}
					/>
				)}

				<SidebarMainContent
					url={url}
					show_notifications={NotificationsOpened}
					isDesktop={isDesktop}
				/>

				{/* Logout Button */}
				{isDesktop && (
					<button
						onClick={() => {
							store.dispatch(startDisconnecting());
							navigate('/auth/logout', { replace: true });
						}}
						className="text-center underline"
					>
						Logout
					</button>
				)}
			</div>
		</div>
	);
}
