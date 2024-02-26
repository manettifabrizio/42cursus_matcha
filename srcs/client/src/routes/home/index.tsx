import SideBar from '@/component/home/sidebar/sideBar';
import BottomMenu from '@/component/home/bottom_menu/bottomMenu';
import FormContainer from '@/component/layout/form/formContainer';
import MatchaLogo from '@/component/ui/matchaLogo';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Outlet } from 'react-router-dom';
import { StoreState } from '@/core/store';
import { useSelector } from 'react-redux';
import Notifications from '@/component/home/notifications/notifications';
import { URLType } from '@/feature/types';

type SidebarMainContentProps = {
	form?: boolean;
	logo?: boolean;
};

export default function SidebarMainContent({
	form = true,
	logo = true,
}: SidebarMainContentProps) {
	const [url, setUrl] = useState<URLType>('home');
	const isDesktop = useMediaQuery({ query: '(min-width: 640px)' });
	const notificationsOpen = useSelector(
		(state: StoreState) => state.interactions.notifications_open,
	);
	const sidebarOpen = useSelector(
		(state: StoreState) => state.interactions.sidebar_open,
	);

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 min-h-0">
				{!isDesktop && notificationsOpen && (
					<div className="w-full h-full flex flex-col pt-4 px-4">
						<Notifications />
					</div>
				)}
				{(isDesktop || (sidebarOpen && !notificationsOpen)) && (
					<SideBar setUrl={setUrl} url={url} isDesktop={isDesktop} />
				)}
				{((!sidebarOpen && !notificationsOpen) || isDesktop) &&
					(form ? (
						<div className="flex justify-between flex-col items-center h-full sm:ml-72">
							{logo && <MatchaLogo to="/home" />}
							<FormContainer size="sm">
								<Outlet />
							</FormContainer>
						</div>
					) : (
						<div className="flex justify-between flex-col h-full sm:ml-72">
							{logo && <MatchaLogo to="/home" />}
							<Outlet />
						</div>
					))}
			</div>
			{!isDesktop && <BottomMenu url={url} />}
		</div>
	);
}
