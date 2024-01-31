export interface MessageType {
	id: number;
	id_user_from: number;
	id_user_to: number;
	content: string;
	created_at: Date;
	seen?: boolean;
}

export type NotificationType = 'like' | 'unlike' | 'match' | 'message' | 'view';

export type Notification = {
	id: number;
	seen: boolean;
	type: NotificationType;
	firstname: string;
	userId: number;
	createdAt: string;
	messageContent?: string;
	userPicture?: string;
};

export type FromPayload = {
	id_user_from: number;
	firstname: string;
	lastname: string;
};
