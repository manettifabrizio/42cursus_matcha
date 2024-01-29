import { MessageType } from '@/feature/interactions/types';
import { Profile } from '@/feature/user/types';
import Message from './message';

type MessageGroupProps = {
	other_user: Profile;
	messages: MessageType[];
};

export default function MessageGroup({
	messages,
	other_user,
}: MessageGroupProps) {
	return messages.map((message) => {
		const is_me = message.id_user_from !== other_user.id ? false : true;

		return (
			<div
				key={message.id}
				style={{
					justifyContent: is_me ? 'start' : 'end',
				}}
				className={
					'flex w-full scroller-item ' + (is_me ? 'start' : 'end')
				}
			>
				<Message message={message} id_other_user={other_user.id} />
			</div>
		);
	});
}
