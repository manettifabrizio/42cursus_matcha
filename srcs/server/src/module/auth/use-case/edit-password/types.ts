export type ActionInput =
{
	id: number;
	password: string;
	password_confirm: string;
};

export type ValidationInput =
	ActionInput
;

export type ValidationOuput =
	Omit<ValidationInput, 'password_confirm'>
;

export type QueryInput =
	ValidationOuput
;

export type QueryOutput =
	boolean
;

export type ActionOutput =
	QueryOutput
;
