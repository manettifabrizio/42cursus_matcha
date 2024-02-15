import MImage from '@/component/ui/mImage';
import { StoreState } from '@/core/store';
import { getMessages } from '@/feature/interactions/store.slice';
import { Profile } from '@/feature/user/types';
import { useStoreDispatch } from '@/hook/useStore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

type ChatProps = {
	user: Profile;
};

export default function Chat({ user }: ChatProps) {
	const [new_message, setNewMessage] = useState(false);
	const dispatch = useStoreDispatch();

	const new_messages = useSelector((state: StoreState) => {
		const messages = state.interactions.messages[user.id];

		if (messages && messages.length > 0)
			return state.interactions.messages[user.id].filter(
				(message) => !message.seen,
			).length;
		else return 0;
	});

	const last_message = useSelector((state: StoreState) => {
		const messages = state.interactions.messages[user.id];

		if (messages) {
			const sorted_messages = [...messages].sort((a, b) => a.id - b.id);

			return sorted_messages &&
				sorted_messages.length > 0 &&
				sorted_messages[sorted_messages.length - 1]
				? sorted_messages[sorted_messages.length - 1]
				: undefined;
		}

		return undefined;
	});

	useEffect(() => {
		dispatch(getMessages({ id_user: user.id, page: 0 }));
	}, [dispatch, user.id]);

	useEffect(() => {
		if ((last_message && !last_message.seen) || !last_message) {
			console.log(last_message);
			setNewMessage(true);
		} else setNewMessage(false);
	}, [last_message]);

	return (
		<li className="mb-1 w-full">
			<Link
				to={`/chat/${user.id}`}
				className="flex flex-nowrap items-center overflow-x-hidden"
			>
				<MImage
					src={`${user.picture?.path}`}
					alt="Avatar"
					className="mr-2 inset-0 h-12 w-12 object-cover rounded-full"
				/>
				<div
					className={
						'flex-1 flex justify-between flex-row items-center w-[calc(100%-3rem)]  ' +
						(new_message && 'font-bold')
					}
				>
					<div>
						<p
							title={user.firstname}
							className={
								'text-ellipsis whitespace-nowrap overflow-x-hidden'
							}
						>
							{user.firstname}
						</p>
						<p
							title={
								last_message?.content ?? 'You have a new match!'
							}
							className={
								'text-ellipsis whitespace-nowrap overflow-x-hidden ' +
								(new_message ? 'text-white' : 'text-gray-400')
							}
						>
							{last_message?.content ?? 'You have a new match!'}
						</p>
					</div>
					{new_messages > 0 && (
						<div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-600 to-amber-400 text-white flex text-xs items-center justify-center">
							{new_messages}
						</div>
					)}
				</div>
			</Link>
		</li>
	);
}
