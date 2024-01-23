import { MessageType } from '@/feature/interactions/types';

type MessageProps = {
	id_other_user: number;
	message: MessageType;
};

export default function Message({ id_other_user, message }: MessageProps) {
	return (
		<li
			className={
				'py-1 px-3 rounded-lg max-w-xs' +
				(id_other_user === message.id_user_from
					? ' bg-gradient-to-r from-red-600 to-amber-400 text-white'
					: ' bg-gradient-to-l from-red-500 to-blue-800')
			}
		>
			{message.content}
		</li>
	);
}
