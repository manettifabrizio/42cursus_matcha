import { Profile } from '@/feature/user/types';
import { MessageType } from '@/feature/interactions/types';
import { groupMessagesByDayAndUserFrom } from '@/tool/messageTools';
import MessageGroup from './messageGroup';

type ChatMainContentProps = {
	other_user: Profile;
	messages: MessageType[];
};

export default function ChatMainContent({
	other_user,
	messages,
}: ChatMainContentProps) {
	const sorted_messages = [...messages].sort((a, b) => a.id - b.id);

	const grouped_messages: { [day: string]: MessageType[][] } =
		groupMessagesByDayAndUserFrom(sorted_messages);

	return (
		<div className="flex-1 my-2 px-2 scroller">
			<ul className="flex flex-col w-full scroller-content">
				{Object.keys(grouped_messages).map((key) => (
					<div className="flex flex-col gap-1" id={key}>
						<div className="flex justify-center">
							<span className="text-gray-400">{key}</span>
						</div>
						{grouped_messages[key].map((message_group) => (
							<div className="message-group gap-1 flex flex-col">
								<MessageGroup
									messages={message_group}
									other_user={other_user}
								/>
							</div>
						))}
					</div>
				))}
			</ul>
		</div>
	);
}
