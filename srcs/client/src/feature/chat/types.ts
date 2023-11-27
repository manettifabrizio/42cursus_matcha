export interface Message {
	id: number;
	id_user_from: number;
	id_user_to: number;
	content: string;
	created_at: Date;
}
