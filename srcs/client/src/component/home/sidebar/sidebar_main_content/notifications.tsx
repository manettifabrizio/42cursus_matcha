import { StoreState } from '@/core/store';
import { chooseNotificationContent } from '@/feature/interactions/notificationsContent';
import {
	readNotifications,
	rmNotification,
} from '@/feature/interactions/store.slice';
import { useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';

export default function Notifications() {
	const notifications = useSelector(
		(state: StoreState) => state.interactions.notifications,
	);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(readNotifications());
	}, [dispatch]);

	return (
		<>
			<p className="font-bold mb-2 text-2xl">Notifications</p>
			<div className="mb-4 flex flex-col h-full overflow-scroll no-scrollbar">
				<div
					className={
						'flex flex-col h-full no-scrollbar' +
						(notifications.length === 0 &&
							' justify-center items-center')
					}
				>
					{notifications.length === 0 ? (
						<div className="italic text-gray-500 text-sm">
							No notifications
						</div>
					) : (
						<ul className="flex flex-col list-none p-0">
							{notifications.toReversed().map((notification) => {
								return (
									<li
										key={notification.id}
										className="flex flex-row items-center justify-between w-full rounded-lg p-1 mb-2 border-gray-300 text-sm"
									>
										<div className="flex justify-start items-center w-10/12">
											{chooseNotificationContent(
												notification.type,
												notification.firstname,
												notification.userId,
												notification.createdAt,
											)}
										</div>
										<button
											className="w-5"
											onClick={() =>
												dispatch(
													rmNotification(
														notification.id,
													),
												)
											}
										>
											<AiOutlineClose />
										</button>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			</div>
		</>
	);
}
