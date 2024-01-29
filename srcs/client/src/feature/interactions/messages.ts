import { MessageType } from './types';

export function createMessage(
	id_user_to: number,
	id_user_from: number,
	content: string,
	created_at?: Date,
	seen?: boolean,
): MessageType {
	return {
		id: 0,
		id_user_from,
		id_user_to,
		content,
		created_at: created_at ?? new Date(),
		seen: seen ?? false,
	};
}
