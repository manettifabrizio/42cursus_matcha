import { StoreState, store } from '@/core/store';
import { Profile } from '@/feature/user/types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

type ChatProps = {
	user: Profile;
};

export default function Chat({ user }: ChatProps) {
	const last_message = useSelector((state: StoreState) => {
		const messages = state.interactions.messages[user.id];
		return messages &&
			messages.length > 0 &&
			messages[messages.length - 1].content
			? messages[messages.length - 1].content
			: undefined;
	});

	console.log(
		'chat user',
		user,
		store.getState().interactions.messages[user.id],
	);

	const new_message = !last_message;

	return (
		<li className="mb-1">
			<Link to={`/chat/${user.id}`} className="flex items-center">
				<img
					src={`${location.origin}/api/pictures/${user.picture?.path}`}
					alt="Chat"
					className="mr-2 inset-0 h-12 w-12 object-cover rounded-full"
				/>
				<div
					className={
						'flex flex-col justify-end ' +
						(new_message && 'font-bold')
					}
				>
					<p>{user.firstname}</p>
					<p className={new_message ? 'text-white' : 'text-gray-400'}>
						{last_message ?? 'You have a new match!'}
					</p>
				</div>
			</Link>
		</li>
	);
}
