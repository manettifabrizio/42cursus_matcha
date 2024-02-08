import { MessageType } from '@/feature/interactions/types';

type MessageProps = {
	id_other_user: number;
	message: MessageType;
};

export default function Message({ id_other_user, message }: MessageProps) {
	function getMessageTime() {
		const date = new Date(message.created_at);
		const options = { timeZone: 'UTC' };

		return date.toLocaleTimeString('en-GB', options).slice(0, -3);
	}

	return (
		<li
			className={
				'py-1 px-3 max-w-xs items-end break-words flex' +
				(id_other_user === message.id_user_from
					? ' bg-gradient-to-r from-red-600 to-amber-400 text-white'
					: ' bg-gradient-to-l from-red-500 to-blue-800')
			}
		>
			<div className="min-w-0">{message.content}</div>
			<p className="ms-2 text-xs opacity-80 flex">{getMessageTime()}</p>
		</li>
	);
}
