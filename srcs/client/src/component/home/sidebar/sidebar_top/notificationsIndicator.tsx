import { StoreState } from '@/core/store';
import { toggleNotifications } from '@/feature/interactions/store.slice';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';

type NotificationsIndicatorProps = {
	show_notifications: boolean;
	isBottom?: boolean;
	setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NotificationsIndicator({
	show_notifications,
	isBottom = undefined,
}: NotificationsIndicatorProps) {
	const dispatch = useDispatch();
	const notifications = useSelector(
		(state: StoreState) => state.interactions.notifications,
	);

	const new_notifications = notifications.filter(
		(notification) => !notification.seen,
	).length;

	return (
		<button
			className="flex items-center justify-center border-transparent cursor-pointer rounded-md p-2"
			onClick={() => dispatch(toggleNotifications(isBottom))}
		>
			{show_notifications && !isBottom ? (
				<AiOutlineClose className="text-2xl" />
			) : new_notifications > 0 ? (
				<div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-600 to-amber-400 text-white flex text-xs items-center justify-center">
					{new_notifications}
				</div>
			) : (
				<IoIosNotificationsOutline className="text-2xl" />
			)}
		</button>
	);
}
