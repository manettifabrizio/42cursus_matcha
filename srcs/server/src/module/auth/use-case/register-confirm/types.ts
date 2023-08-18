export type ActionInput =
{
	id: string;
	secret: string;
};

export type ValidationInput =
	ActionInput
;

export type ValidationOuput =
	ValidationInput
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
