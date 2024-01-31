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
				{Object.keys(grouped_messages).map((day) => (
					<div className="flex flex-col gap-1" key={day}>
						<div className="flex justify-center">
							<span className="text-gray-400">{day}</span>
						</div>
						{grouped_messages[day].map((message_day_group, i) => (
							<div
								className="message-group gap-1 flex flex-col"
								key={i}
							>
								<MessageGroup
									messages={message_day_group}
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
