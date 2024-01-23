import { Profile } from '@/feature/user/types';
import Message from './message';
import { MessageType } from '@/feature/interactions/types';

type ChatMainContentProps = {
	other_user: Profile;
	messages: MessageType[];
};

export default function ChatMainContent({
	other_user,
	messages,
}: ChatMainContentProps) {
	return (
		<div className="flex-1 my-2 px-2 scroller">
			<ul className="flex flex-col w-full gap-1 scroller-content">
				{[...messages]
					.sort((a, b) => a.id - b.id)
					.map((message) => (
						<div
							key={message.id}
							className={
								'flex w-full transform scroller-item justify-' +
								(message.id_user_from === other_user.id
									? 'start'
									: 'end')
							}
						>
							<Message
								message={message}
								id_other_user={other_user.id}
							/>
						</div>
					))}
			</ul>
		</div>
	);
}
