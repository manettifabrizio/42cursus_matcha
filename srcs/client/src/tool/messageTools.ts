import { MessageType } from '@/feature/interactions/types';

function groupMessagesByDay(messages: MessageType[]) {
	const groupedMessagesByDay: { [day: string]: MessageType[] } = {};

	messages.forEach((message) => {
		const day = new Date(message.created_at).toLocaleDateString('en-GB');

		if (!groupedMessagesByDay[day]) {
			groupedMessagesByDay[day] = [];
		}

		groupedMessagesByDay[day].push(message);
	});

	return groupedMessagesByDay;
}

function groupMessagesByUserId(messages: MessageType[]): MessageType[][] {
	const groupedMessagesByUserId: MessageType[][] = [];

	let currentUserFromId: number | null = null;
	let currentUserFromGroup: MessageType[] = [];

	for (const message of messages) {
		if (currentUserFromId !== message.id_user_from) {
			// If id_user_from changes, start a new array
			if (currentUserFromGroup.length > 0) {
				groupedMessagesByUserId.push(currentUserFromGroup);
			}

			currentUserFromId = message.id_user_from;
			currentUserFromGroup = [message];
		} else {
			// If id_user_from is the same, add to the current array
			currentUserFromGroup.push(message);
		}
	}

	// Add the last array
	if (currentUserFromGroup.length > 0) {
		groupedMessagesByUserId.push(currentUserFromGroup);
	}

	return groupedMessagesByUserId;
}

export function groupMessagesByDayAndUserFrom(messages: MessageType[]): {
	[day: string]: MessageType[][];
} {
	const groupedMessages: { [day: string]: MessageType[][] } = {};

	const groupedMessagesByDay = groupMessagesByDay(messages);

	// Group messages by id_user_from
	Object.keys(groupedMessagesByDay).forEach((day) => {
		groupedMessages[day] = groupMessagesByUserId(groupedMessagesByDay[day]);
	});

	return groupedMessages;
}
