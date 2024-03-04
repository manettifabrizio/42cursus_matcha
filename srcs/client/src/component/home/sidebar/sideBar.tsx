import { StoreState } from '@/core/store';
import SidebarMainContent from './sidebar_main_content/sideBarMainContent';
import { useSelector } from 'react-redux';
import SidebarTop from './sidebar_top/sidebarTop';

type SideBarProps = {
	isDesktop: boolean;
};

export default function SideBar({ isDesktop }: SideBarProps) {
	const NotificationsOpened = useSelector(
		(state: StoreState) => state.interactions.notifications_open,
	);
	const url = useSelector((state: StoreState) => state.interactions.url);

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
				<SidebarTop
					url={url}
					NotificationsOpened={NotificationsOpened}
					isDesktop={isDesktop}
				/>

				<SidebarMainContent
					show_notifications={NotificationsOpened}
					isDesktop={isDesktop}
				/>
			</div>
		</div>
	);
}
