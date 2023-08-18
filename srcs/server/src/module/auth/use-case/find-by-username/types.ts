import { Account } from '../../entity';


export type ActionInput =
{
	username: string;
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
	Account | null
;

export type ActionOutput =
	QueryOutput
;
