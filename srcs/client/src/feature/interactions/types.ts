export interface Message {
	id: number;
	id_user_from: number;
	id_user_to: number;
	content: string;
	created_at: Date;
}

export type NotificationType = 'like' | 'unlike' | 'match' | 'message' | 'view';

export type Notification = {
	id: number;
	seen: boolean;
	type: NotificationType;
	firstname: string;
	userId: number;
	createdAt: string;
};
