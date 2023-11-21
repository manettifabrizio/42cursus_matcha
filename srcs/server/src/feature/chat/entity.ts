// Type ------------------------------------------------------------------------
export type Message = {
	id: number;
	id_user_from: number;
	id_user_to: number;
	content: text;
	created_at: Date;
};

export type Pagination = {
	index: number;
	size: number;
};
